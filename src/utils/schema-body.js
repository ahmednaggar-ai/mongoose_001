/**
 * Keys on `body` that are not paths on the Mongoose schema (unknown / not allowed).
 */
export function getUnknownSchemaKeys(body, schema) {
    if (!body || typeof body !== "object") return [];
    const allowed = new Set(Object.keys(schema.paths));
    return Object.keys(body).filter((key) => !allowed.has(key));
}

export function unknownFieldsErrorPayload(invalidFields) {
    return {
        success: false,
        message:
            invalidFields.length === 1
                ? `Invalid field "${invalidFields[0]}" — not defined on this model`
                : `Invalid fields not defined on this model: ${invalidFields.join(", ")}`,
        invalidFields: invalidFields[0],
    };
}
