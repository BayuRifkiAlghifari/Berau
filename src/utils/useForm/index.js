import {useState} from 'react';

const useForm = (initialValue) => {
  const [form, setForm] = useState(initialValue);
  return [
    form,
    (formType, formValue, formPrev) => {
      if (formType === 'reset') {
        if(formPrev) {
          let objNew = {};
          Object.keys(formPrev).map(key => objNew[key] = formPrev[key]);
          return setForm({...initialValue, ...objNew});
        } else {
          return setForm(initialValue);
        }
      }
      return setForm({...form, [formType]: formValue});
    },
  ];
};

export default useForm;
