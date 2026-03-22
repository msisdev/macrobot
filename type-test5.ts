import { InteractionType as A } from 'discord-api-types/v10';
import { InteractionType as B } from 'discord-interactions';

type ExtractValue<T, E> = `${T & number}` extends `${infer N extends number}` ? Extract<E, N> : never;

let x: ExtractValue<A.Ping, B> = 123 as any;
x.foo;
