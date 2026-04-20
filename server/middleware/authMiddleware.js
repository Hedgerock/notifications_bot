import {ResHeaders, ResponseStatus, UserRoles} from "../constants/index.js";
import jwt from "jsonwebtoken";
import {AppCoreConstants} from "../constants/AppCoreConstantsClass.js";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers[ResHeaders.AUTHORIZATION];

    if (!authHeader) {
        return res.status(ResponseStatus.UNAUTHORIZED).json({
            message: "Авторизационный токен не найден"
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        /**
         *
         * @type {JwtTokenFields}
         */
        const decoded = /** @type{JwtTokenFields} */ jwt.verify(token, AppCoreConstants.JWT_SECRET);

        if (decoded.role !== UserRoles.ADMIN) {
            return res.status(ResponseStatus.FORBIDDEN).json({
                message: "У вас недостаточно прав для выполнения данной задачи"
            })
        }

        next();
    } catch (e) {
        res.status(ResponseStatus.UNAUTHORIZED).json({
            message: "Неверный токен"
        })
    }
}