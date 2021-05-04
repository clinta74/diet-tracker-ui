import { ValidationTest } from "../../../utils/validate";

export const validationTests: ValidationTest<Plan>[] =
    [
        {
            passCondition: ({ name }) => name.trim().length > 0,
            result: {
                message: 'There must be a name.',
                name: 'name',
            }
        }
    ];