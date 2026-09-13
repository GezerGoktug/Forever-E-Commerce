export const isEmptyString = (txt: string) => txt.trim().length === 0;

export const cloudinaryImageOptimizer = (url: string) => url.replace("/upload/", "/upload/f_auto,q_auto/");

export const triggerInputEvent = (inputElement: HTMLInputElement | HTMLTextAreaElement) => {
  if (inputElement) {
    const event = new Event("input", { bubbles: true });
    inputElement.dispatchEvent(event);
  }
}

export const triggerNativeInputChange = <T>(inputElement: HTMLInputElement, value: T) => {
  const inputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;

  inputValueSetter?.call(inputElement, value);

  triggerInputEvent(inputElement)
};