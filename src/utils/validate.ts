export interface ValidationTest<M, P> { 
    passCondition: (params: P) => boolean, result: M 
}

export interface ValidationResult<M = unknown> {
    valid: boolean,
    results: M[] | [],
}

export type SimpleValidationTest<M> = ValidationTest<string, {item: M, items: M[]}>;

const sumValidationResult = <M>(result1: ValidationResult<M>, result2: ValidationResult<M>) => {
    const valid = result1.valid && result2.valid;
    return ({
        valid,
        results: result2.valid ? result1.results : [...result1.results, ...result2.results],
    });
};

const validate = <M, P>(test: ValidationTest<M, P>, params: P): ValidationResult<M>  => {
    return ({
        valid: test.passCondition(params),
        results: [test.result],
    });
};

const getValidResult = <M>() => {
    return ({
        valid: true,
        results: new Array<M>(),
    });
};

const validateAll = <M, P>(tests: ValidationTest<M, P>[], params: P):[ valid: boolean, results: M[]] => {
    const testResults = tests.reduce((prev, next) => {
        return sumValidationResult<M>(prev as ValidationResult<M>, validate<M, P>(next, params))
    }, getValidResult<M>());

    return [ testResults.valid, testResults.results ];
};

export {
    validate,
    validateAll
};