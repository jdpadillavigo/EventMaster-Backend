import { OAuth2Client } from 'google-auth-library';
import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { IClienteRepository } from '../../../domain/interfaces/IClienteRepository';
import { LoginResultDto } from '../dtos/LoginDto';

export class GoogleLoginUseCase {
    private client: OAuth2Client;

    constructor(
        private usuarioRepository: IUsuarioRepository,
        private clienteRepository: IClienteRepository
    ) {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async execute(idToken: string): Promise<LoginResultDto> {
        try {
            // 1. Verificar el token de Google
            const ticket = await this.client.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID || '',
            });

            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                throw new Error('Token de Google inválido o sin email');
            }

            const email = payload.email;
            const firstName = payload.given_name || 'Usuario';
            const lastName = payload.family_name || 'Google';
            const picture = payload.picture;

            // 2. Buscar si el usuario ya existe
            let usuario = await this.usuarioRepository.findByEmail(email);

            // 3. Si no existe, crearlo
            if (!usuario) {
                // Generar una contraseña aleatoria segura
                const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);

                usuario = await this.usuarioRepository.create({
                    correo: email,
                    clave: randomPassword,
                    isActive: true // Usuarios de Google están activos por defecto
                });

                // Crear perfil de cliente
                // Nota: IClienteRepository.create solo acepta nombre, apellido, usuario_id. 
                // Si queremos guardar foto, necesitamos actualizar el repositorio o hacerlo en un paso separado si la DB lo soporta.
                // Por ahora lo guardamos sin foto y luego intentamos actualizar si es posible, o ignoramos la foto en creación si el repo no lo soporta.
                await this.clienteRepository.create({
                    nombre: firstName,
                    apellido: lastName,
                    usuario_id: usuario.usuario_id
                });

                // Intentar actualizar foto si el repositorio lo permite (usando any para bypass de tipo estricto si el metodo update lo soporta en runtime)
                if (picture) {
                    try {
                        await this.clienteRepository.update(usuario.usuario_id, { nombre: firstName, apellido: lastName, foto_perfil: picture } as any);
                    } catch (e) {
                        console.warn('No se pudo guardar la foto de perfil de Google:', e);
                    }
                }

            } else {
                if (!usuario.isActive) {
                    // Opcional: Activar usuario
                }
            }

            // 4. Retornar datos
            const cliente = await this.clienteRepository.findByUsuarioId(usuario.usuario_id);

            return {
                success: true,
                message: 'Login con Google exitoso',
                user: {
                    usuario_id: usuario.usuario_id,
                    correo: usuario.correo,
                    nombre: cliente?.nombre || firstName,
                    apellido: cliente?.apellido || lastName,
                    foto_perfil: cliente?.foto_perfil || picture
                }
            };

        } catch (error: any) {
            console.error('Error en Google Login UseCase:', error);
            throw new Error('Error al autenticar con Google: ' + error.message);
        }
    }
}
