import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

// Extend the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: number }
    }
  }
}

interface JwtPayload {
  sub: number // ID del usuario como número
}

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Formato de token inválido. Usa: Bearer <token>',
    })
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error('JWT_SECRET no está definido en las variables de entorno')
    return res.status(500).json({
      success: false,
      message: 'Error de configuración del servidor',
    })
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
    })
  }
  
  try {
    const decoded = jwt.verify(token, secret) as unknown as JwtPayload

    if (typeof decoded.sub !== 'number' || isNaN(decoded.sub)) {
      return res.status(401).json({
        success: false,
        message: 'ID inválido en el token',
      })
    }

    // asignamos el usuario al request con el tipo correcto
    req.user = { id: decoded.sub }

    next()
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? 'Token expirado'
        : 'Token inválido'
    return res.status(401).json({ success: false, message })
  }
}