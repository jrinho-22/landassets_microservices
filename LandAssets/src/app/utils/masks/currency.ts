import { createMask } from "@ngneat/input-mask";

export const currencyInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 2,
    digitsOptional: false,
    prefix: '$ ',
    placeholder: '0',    
});

export const cardNumberMask = createMask('9999 9999 9999 9999');

export const cardValidadeMask = createMask('99/99');

export const cardCodigoMask = createMask('999');