export function health(req, res) {

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Auth Service is healthy'));

}