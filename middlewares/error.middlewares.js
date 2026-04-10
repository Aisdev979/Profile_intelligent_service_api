const errorMiddleware = (err, req, res, next) => {
	const statusCode = err.statusCode || err.status || 500;
	const message = err.message || "Internal Server Error";
	//console.error(err);

	res.status(statusCode).json({
		status: "error",
		error: message,
	});
};

export default errorMiddleware;;
