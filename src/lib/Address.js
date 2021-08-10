/* eslint-disable new-cap */
/* eslint-disable no-else-return */
import Wallet from 'ethereumjs-wallet';
import bitcoin, {
  ECPair,
  payments,
  crypto,
  script,
  Transaction,
} from 'bitcoinjs-lib';
import litecore from 'litecore-lib';
import dashcore from 'dashcore-lib';
import bitcore, { Signature } from 'bitcore-lib';
import dogecore from 'dogecore';
import { generateMnemonic } from 'bip39';
import bitcorecash from 'bitcore-lib-cash';
import {
  deriveAddress,
  deriveKeypair,
  generateSeed,
} from 'ripple-keypairs';
import rippleLib from 'ripple-lib';

import { Device } from 'lib';
import {
  generateSessionKey,
  aesEncrypt,
  aesDecrypt,
} from '../crypto';
import { KEYPAIR_TYPES } from '../../utils';
import Axios from 'axios';
import buffer from 'bitcore-lib-cash/lib/util/buffer';

class Address {
  docData = {
    address: '',
    updatedAt: '',
    createdAt: '',
    knownValue: '0',
    addressType: '',
    privateKey: {},
    publicKey: '',
    wif: {},
  };

  constructor(data) {
    if (data) {
      this.docData = { ...data };
      if (!this.docData.createdAt) {
        this.docData.createdAt = Date.now();
      }
    } else {
      this.docData.createdAt = Date.now();
    }
  }

  async generate(addressType) {
    this.docData.addressType = addressType;

    const sessionKey = await generateSessionKey();
    const sessionKeyBuf = Buffer.from(sessionKey.randomString, 'ascii');

    // generating a mnemonic for the bitcore-based libraries to guarantee we're
    // not relying on their EC keygen functions
    const mnemonic = generateMnemonic();
    const mnemonicBuf = new Buffer(mnemonic);
    const newDevice = new Device();
    await newDevice.getYubikeyInfo();
    if (!newDevice.docData.serialNumber) {
      throw new Error('No Device Connected! Please connect your YubiKey and try again.');
    }
    const encryptedSessionKey = await newDevice.encryptData(sessionKey.randomString);

    if (addressType === KEYPAIR_TYPES.XRP) {
      const xrpSeed = generateSeed();
      const kp = deriveKeypair(xrpSeed);
      this.docData.address = deriveAddress(kp.publicKey);
      this.docData.publicKey = kp.publicKey;

      const encryptedSeed = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(xrpSeed, 'ascii'),
      );
      this.docData.wif = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedSeed.encryptedData,
        salt: encryptedSeed.salt,
      };

      const encryptedPk = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(kp.privateKey, 'hex'),
      );
      this.docData.privateKey = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedPk.encryptedData,
        salt: encryptedPk.salt,
      };

      return;
    }

    if (addressType === KEYPAIR_TYPES.ETHEREUM) {
      //
      const wallet = Wallet.generate();
      this.docData.address = wallet.getAddressString();
      this.docData.publicKey = wallet.getPublicKeyString();
      const encryptedContent = await aesEncrypt(
        sessionKeyBuf,
        wallet.getPrivateKey(),
      );
      this.docData.privateKey = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedContent.encryptedData,
        salt: encryptedContent.salt,
      };

      return;
    }

    let privateKey;
    if (addressType === KEYPAIR_TYPES.LITECOIN) {
      privateKey = new litecore.PrivateKey();
    }
    if (addressType === KEYPAIR_TYPES.DOGECOIN) {
      privateKey = new dogecore.PrivateKey();
    }
    if (addressType === KEYPAIR_TYPES.DASH) {
      privateKey = new dashcore.PrivateKey();
    }
    if (addressType === KEYPAIR_TYPES.BITCOIN) {
      privateKey = new bitcore.PrivateKey();
    }

    if (privateKey) {
      this.docData.address = privateKey.toAddress().toString();
      this.docData.publicKey = privateKey.toPublicKey().toString();
  
      const encryptedWif = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(privateKey.toWIF(), 'utf-8'),
      );
      this.docData.wif = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedWif.encryptedData,
        salt: encryptedWif.salt,
      };
  
      const encryptedPriv = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(privateKey.toString()),
      );
      this.docData.privateKey = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedPriv.encryptedData,
        salt: encryptedPriv.salt,
      };
  
      return;
    }
  }

  async import(addressType, data) {
    this.docData.addressType = addressType;

    const sessionKey = await generateSessionKey();
    const sessionKeyBuf = Buffer.from(sessionKey.randomString, 'ascii');
    const newDevice = new Device();
    await newDevice.getYubikeyInfo();
    if (!newDevice.docData.serialNumber) {
      throw new Error('No Device Connected! Please connect your YubiKey and try again.');
    }
    const encryptedSessionKey = await newDevice.encryptData(sessionKey.randomString);

    if (addressType === KEYPAIR_TYPES.XRP) {
      const kp = deriveKeypair(data);
      this.docData.address = deriveAddress(kp.publicKey);
      this.docData.publicKey = kp.publicKey;

      const encryptedSeed = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(data, 'ascii'),
      );
      this.docData.wif = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedSeed.encryptedData,
        salt: encryptedSeed.salt,
      };

      const encryptedPk = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(kp.privateKey, 'hex'),
      );
      this.docData.privateKey = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedPk.encryptedData,
        salt: encryptedPk.salt,
      };

      return;
    }

    if (addressType === KEYPAIR_TYPES.ETHEREUM) {
      //
      const wallet = Wallet.fromPrivateKey(Buffer.from(data, 'hex'));
      this.docData.address = wallet.getAddressString();
      this.docData.publicKey = wallet.getPublicKeyString();

      const encryptedContent = await aesEncrypt(
        sessionKeyBuf,
        wallet.getPrivateKey(),
      );
      this.docData.privateKey = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedContent.encryptedData,
        salt: encryptedContent.salt,
      };

      return;
    }

    let privateKey;
    if (addressType === KEYPAIR_TYPES.LITECOIN) {
      privateKey = new litecore.PrivateKey.fromWIF(data);
    }
    if (addressType === KEYPAIR_TYPES.DOGECOIN) {
      privateKey = new dogecore.PrivateKey.fromWIF(data);
    }
    if (addressType === KEYPAIR_TYPES.DASH) {
      privateKey = new dashcore.PrivateKey.fromWIF(data);
    }
    if (addressType === KEYPAIR_TYPES.BITCOIN) {
      privateKey = new bitcore.PrivateKey(data);
    }

    if (privateKey) {
      this.docData.address = privateKey.toAddress().toString();
      this.docData.publicKey = privateKey.toPublicKey().toString();
  
      const encryptedWif = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(privateKey.toWIF(), 'utf-8'),
      );
      this.docData.wif = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedWif.encryptedData,
        salt: encryptedWif.salt,
      };
  
      const encryptedPriv = await aesEncrypt(
        sessionKeyBuf,
        Buffer.from(privateKey.toString()),
      );
      this.docData.privateKey = {
        sessionKey: encryptedSessionKey.encryptedData,
        cipherText: encryptedPriv.encryptedData,
        salt: encryptedPriv.salt,
      };
  
      return;
    }
  }

  /**
   * This function is kind of annoying because of how inconsistent
   * JavaScript libraries are when it comes to crypto. In most cases
   * we will load the private key into a particular library's private key
   * instantiation function, and then move that into bitcoinjs-lib's library
   * because the actual private key signing data can be done with
   * any ECDSA signing library.
   * @param {*} toSignArray 
   * @param {*} decryptedKey 
   */
  async sign(toSignArray, decryptedKey) {
    const addressType = this.docData.addressType;
    console.log(decryptedKey);

    let tempPrivateKey;
    let publicKey;

    if (addressType === KEYPAIR_TYPES.XRP) {
      // tempPrivateKey = new
    }

    if (addressType === KEYPAIR_TYPES.LITECOIN) {
      tempPrivateKey = new litecore.PrivateKey(decryptedKey.wif);
      publicKey = tempPrivateKey.toPublicKey().toString();
    }

    if (addressType === KEYPAIR_TYPES.DOGECOIN) {
      tempPrivateKey = new dogecore.PrivateKey(decryptedKey.wif);
      publicKey = tempPrivateKey.toPublicKey().toString();
    }

    if (addressType === KEYPAIR_TYPES.DASH) {
      tempPrivateKey = new dashcore.PrivateKey(decryptedKey.wif);
      publicKey = tempPrivateKey.toPublicKey().toString();
    }

    if (addressType === KEYPAIR_TYPES.BITCOIN) {
      tempPrivateKey = new bitcore.PrivateKey(decryptedKey.wif);
      publicKey = tempPrivateKey.toPublicKey().toString();
    }

    if (addressType === KEYPAIR_TYPES.BLOCKCYPHER) {
      tempPrivateKey = new bitcore.PrivateKey(decryptedKey.wif, BLOCKCYPHER);
      publicKey = tempPrivateKey.toPublicKey().toString();
    }

    const usableKey = ECPair.fromPrivateKey(Buffer.from(tempPrivateKey.toString('hex'), 'hex'));
    const signatures = toSignArray.map((toSign) => {
      const tempSignature = usableKey.sign(Buffer.from(toSign, 'hex'));
      // the slice at the end is just chopping off the hashtype bytes, which blockcypher adds in
      return script.signature.encode(tempSignature, Transaction.SIGHASH_NONE).toString('hex').slice(0, -2);
    });

    return {
      publicKeys: [ publicKey ],
      signatures,
    };
  }

  async export(pin) {
    const newDevice = new Device();
    await newDevice.getYubikeyInfo();
    if (!newDevice.docData.serialNumber) {
      throw new Error('No Device Connected! Please connect your YubiKey and try again.');
    }

    // decrypt the private key, which should always be present
    console.log(this.docData.privateKey);
    const pSessionKey = this.docData.privateKey.sessionKey;
    const pDecryptedSessionKey = await newDevice.decryptData(pin, pSessionKey);
    const pSessionKeyBuf = Buffer.from(pDecryptedSessionKey.decryptedData, 'ascii');
    const pSaltBuf = Buffer.from(this.docData.privateKey.salt, 'base64');
    const pCipherBuf = Buffer.from(this.docData.privateKey.cipherText, 'base64');
    const decryptedPrivateKey = await aesDecrypt(pSessionKeyBuf, pSaltBuf, pCipherBuf);

    // decrypt the WIF if it exists
    if (this.docData.wif && this.docData.wif.sessionKey) {
      const wEncSessionKey = this.docData.wif.sessionKey;
      const wDecryptedSessionKey = await newDevice.decryptData(pin, wEncSessionKey);
      const wSessionKeyBuf = Buffer.from(wDecryptedSessionKey.decryptedData, 'ascii');
      const wSaltBuf = Buffer.from(this.docData.wif.salt, 'base64');
      const wCipherBuf = Buffer.from(this.docData.wif.cipherText, 'base64');
      const decryptedWif = await aesDecrypt(wSessionKeyBuf, wSaltBuf, wCipherBuf);
      const decodedWif = Buffer.from(decryptedWif.decryptedData, 'base64');

      if (this.docData.addressType === KEYPAIR_TYPES.XRP) {
        // we have to handle XRP a little differently
        return {
          privateKey: Buffer.from(decryptedPrivateKey.decryptedData, 'base64').toString('hex'),
          seed: decodedWif.toString(),
        };
      }

      return {
        privateKey: Buffer.from(decryptedPrivateKey.decryptedData, 'base64').toString(),
        wif: decodedWif.toString(),
      };
    }
    return {
      privateKey: Buffer.from(decryptedPrivateKey.decryptedData, 'base64').toString('hex'),
    };
  }

  async getBalance() {
    let response;
    if (this.docData.addressType === KEYPAIR_TYPES.BITCOIN) {
      response = await Axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${this.docData.address}/balance`);
    } else if (this.docData.addressType === KEYPAIR_TYPES.LITECOIN) {
      response = await Axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${this.docData.address}/balance`);
    } else if (this.docData.addressType === KEYPAIR_TYPES.DASH) {
      response = await Axios.get(`https://api.blockcypher.com/v1/dash/main/addrs/${this.docData.address}/balance`);
    } else if (this.docData.addressType === KEYPAIR_TYPES.BLOCKCYPHER) {
      response = await Axios.get(`https://api.blockcypher.com/v1/bcy/test/addrs/${this.docData.address}/balance`);
    } else if (this.docData.addressType === KEYPAIR_TYPES.DOGECOIN) {
      response = await Axios.get(`https://api.blockcypher.com/v1/doge/main/addrs/${this.docData.address}/balance`);
    } else if (this.docData.addressType === KEYPAIR_TYPES.ETHEREUM) {
      response = await Axios.get(`https://api.blockcypher.com/v1/eth/main/addrs/${this.docData.address}/balance`);
    }
    if (response) {
      console.log(response);
      return response.data.balance;
    }
    return 0;
  }
}

export default Address;
