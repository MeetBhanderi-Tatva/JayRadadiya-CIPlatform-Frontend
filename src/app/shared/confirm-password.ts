import {
    AbstractControl,
    ValidatorFn,
  } from '@angular/forms';
  
  export const matchValidator = (controlName: string, matchingControlName: string): ValidatorFn => {
    return (abstractControl: AbstractControl) => {
        const control = abstractControl.get(controlName);
        const matchingControl = abstractControl.get(matchingControlName);

        if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
            return null; // another validator has already found an error on the matchingControl
        }

        if (control!.value !== matchingControl!.value) {
            const error = { confirmedValidator: 'Passwords do not match.' };
          matchingControl!.setErrors(error);
          return error;
        } else {
            matchingControl!.setErrors(null);
            return null;
        }
    };
};


