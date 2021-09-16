/// <reference types="node" />
declare class Wallet {
    address: string;
    publicKey: string;
    privateKey: string;
    seed: Buffer;
    mnemonic: string;

    constructor(address: string, publicKey: string, privateKey: string, seed: Buffer, mnemonic: string);
    encrypt(password: string): any;
}
declare function walletGenerate(): Wallet;
declare function walletImport(mnemonic: string): Wallet;
declare function walletOpen(password: string, data: string): Promise<Wallet>;
export { Wallet, walletGenerate as generate, walletImport as import, walletOpen as opan };
