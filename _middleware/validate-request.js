module.exports = validateRequest;

function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    //custom error handler
    if (error && error.details[0] && error.details[0].context) {
        next({
            statusCode: 422,
            field: error.details[0].context.label,
            message: `Validation error: ${error.details[0].message}`
        });
    }

    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}