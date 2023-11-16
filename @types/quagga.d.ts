declare module 'quagga' {
  export type TCodeResult = {
    code: string
    start: number
    end: number
    format: string
    direction: number
    decodedCodes: any
    codeset: string
  };

  export const init: (params: any, cb: any) => void;
  export const start: () => void;
  export const stop: () => void;
  export const pause: () => void;
  export const onProcessed: (data: any) => void;
  export const onDetected: (cb: (data: {
    box: Array<[number, number]>
    boxes: Array<[number, number]>
    angle: number
    codeResult: TCodeResult
  }) => void) => void;
}