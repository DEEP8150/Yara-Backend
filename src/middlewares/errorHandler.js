import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const errorHandler = (err, req, res, next) => {

    if (err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, err.message, err.errors)
            )
    }
    return res
        .status(500)
        .json(new ApiResponse(500, "Internal Server Error", err.message))
}

export default errorHandler