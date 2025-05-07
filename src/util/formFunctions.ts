export const resetForm = (formId:string) => {
     const formElement: HTMLFormElement | null = document.getElementById(formId) as HTMLFormElement;
          if(formElement){
               return formElement.reset();
          }
}