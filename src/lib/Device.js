/* eslint-disable no-else-return */
import { DeviceSlot } from 'signata-device-manager-client-js';
import * as crypto from '../crypto';
import * as consts from '../consts';
import * as yubikey from '../yubikey';

class Device {
  docData = {
    chuid: '',
    ccc: '',
    serialNumber: '',
    deviceType: '',
    encryptedPuk: {},
    isImported: false,
    slot9a: {},
    slot9b: {},
    slot9c: {},
    slot9d: {},
    slot9e: {},
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

  async initialize(seed) {
    // these user pins don't have to be uber strong, as PINs are brute-force resistant anyway
    // this is just to have a value set for distribution to users, and they'll ideally
    // change it to whatever they want when they receive the device.
    console.log(this.docData.serialNumber);
    console.log('initialize: generating new keys');
    const newUserPin = await crypto.generateNumericString(8);
    const new9bKey = await crypto.generateHexString(consts.YUBIKEY_9B_LENGTH);
    const newPuk = await crypto.generateRandomReadableString(consts.YUBIKEY_PUK_LENGTH);
    console.log(newUserPin);
    console.log(new9bKey);
    console.log(newPuk);

    console.log('initialize: encrypting new keys');
    const encrypted9bKey = await crypto.aesEncrypt(seed, Buffer.from(new9bKey.randomString, 'ascii'));
    const encryptedPuk = await crypto.aesEncrypt(seed, Buffer.from(newPuk.randomString, 'ascii'));
    console.log(encrypted9bKey);
    console.log(encryptedPuk);

    console.log('initialize: resetting piv applet');
    await yubikey.resetPivApplet(this.docData.serialNumber);
    // console.log(resetResult);
    console.log('initialize: setting 9b key');
    await yubikey.setManagementKey(this.docData.serialNumber, consts.YUBIKEY_DEFAULT_9B_KEY, new9bKey.randomString);
    this.docData.slot9b = { ...encrypted9bKey };

    console.log('initialize: setting puk');
    await yubikey.setPuk(this.docData.serialNumber, consts.YUBIKEY_DEFAULT_PUK, newPuk.randomString);
    this.docData.encryptedPuk = { ...encryptedPuk };

    console.log('initialize: setting pin');
    await yubikey.resetUserPin(this.docData.serialNumber, newPuk.randomString, newUserPin.randomString);
    const toReturn = {
      newPin: newUserPin.randomString,
      newPuk: newPuk.randomString,
      new9bKey: new9bKey.randomString,
      result: consts.MESSAGE_DEVICE_INITIALIZE_SUCCEEDED,
    };
    console.log(toReturn);
    return toReturn;
  }

  /**
   * This function takes the provided keys, encrypts them, rotates
   * them to check they're correct, and stores the values
   * @param {*} seed
   * @param {*} existing9bKey
   * @param {*} existingPuk
   */
  async import(seed, existing9bKey, existingPuk, existingPin) {
    console.log(this.docData.serialNumber);
    // generate some dummy values
    const new9bKey = await crypto.generateHexString(consts.YUBIKEY_9B_LENGTH);
    const newPuk = await crypto.generateRandomReadableString(consts.YUBIKEY_PUK_LENGTH);

    // encrypt the provided values
    const encrypted9bKey = await crypto.aesEncrypt(seed, Buffer.from(existing9bKey, 'ascii'));
    const encryptedPuk = await crypto.aesEncrypt(seed, Buffer.from(existingPuk, 'ascii'));

    console.log('initialize: checking 9b key');
    await yubikey.setManagementKey(this.docData.serialNumber, existing9bKey, new9bKey.randomString);
    await yubikey.setManagementKey(this.docData.serialNumber, new9bKey.randomString, existing9bKey);

    console.log('initialize: checking puk');
    await yubikey.setPuk(this.docData.serialNumber, existingPuk, newPuk.randomString);
    await yubikey.setPuk(this.docData.serialNumber, newPuk.randomString, existingPuk);
  
    console.log(encrypted9bKey);
    console.log(encryptedPuk);
    
    this.docData.slot9b = { ...encrypted9bKey };
    this.docData.encryptedPuk = { ...encryptedPuk };
    this.docData.isImported = true;

    // leave these as "new" so it doesn't need more logic on the controller
    const toReturn = {
      newPin: existingPin,
      newPuk: existingPuk,
      new9bKey:  existing9bKey,
      result: consts.MESSAGE_DEVICE_IMPORT_SUCCEEDED,
    };
    console.log(toReturn);
    return toReturn;
  }

  async reset() {
    console.log('reset');
    await yubikey.resetPivApplet(this.docData.serialNumber);
    return consts.MESSAGE_DEVICE_INITIALIZE_SUCCEEDED;
  }

  async getYubikeyInfo() {
    // console.log('getYubikeyInfo');
    const deviceInfo = await yubikey.getDeviceInfo();

    if (deviceInfo && deviceInfo.connectedDevicesList && deviceInfo.connectedDevicesList[0]) {
      const connectedDevice = deviceInfo.connectedDevicesList[0];
      console.log(this.docData);
      console.log(connectedDevice);
      this.docData.serialNumber = connectedDevice.serialNumber;
      this.docData.deviceType = connectedDevice.deviceType;
    }
  }

  async getYubikeyPivInfo() {
    console.log('getYubikeyPivInfo');
    const pivInfo = await yubikey.getPivInfo();
    console.log('getYubikeyPivInfo: info retrieved');

    this.docData.userPinTriesRemaining = pivInfo.pinTriesRemaining;
    if (pivInfo.chuid !== 'no data available') {
      this.docData.chuid = pivInfo.chuid;
    }
    if (pivInfo.ccc !== 'no data available') {
      this.docData.ccc = pivInfo.ccc;
    }
  }

  async setDeviceMode(
    ccidEnabled,
    otpEnabled,
    fidoEnabled,
    ccidTouchEject,
    ccidAutoEjectTimeout,
    challengeResponseTimeout,
  ) {
    console.log('setDeviceMode');
    const result = await yubikey.setMode(
      this.docData.serialNumber,
      ccidEnabled,
      otpEnabled,
      fidoEnabled,
      ccidTouchEject,
      ccidAutoEjectTimeout,
      challengeResponseTimeout,
    );
  }

  async change9bKey(seed) {
    console.log('changePuk');
    if (!seed) { throw new Error('no-passphrase-provided'); }

    console.log('changePuk: decrypting old 9b key');
    const decrypted9bKey = await crypto.aesDecrypt(seed, this.docData.slot9b.salt, this.docData.slot9b.cipherText);

    console.log('changePuk: generating new puk');
    const new9bKey = crypto.generateHexString(consts.YUBIKEY_9B_LENGTH);

    console.log('changePuk: encrypting new puk');
    const newEncrypted9bKey = await crypto.aesEncrypt(seed, new9bKey);

    console.log('changePuk: setting puk on device');
    const result = await yubikey.setManagementKey(decrypted9bKey.clearText, new9bKey);
    if (!result) { throw new Error(consts.MESSAGE_ERROR_DEVICE_9B_CHANGE_FAILED); }

    this.docData.slot9b = {
      cipherText: newEncrypted9bKey.cipherText,
      salt: newEncrypted9bKey.salt,
    };
    return consts.MESSAGE_DEVICE_CHANGE_9B_KEY_SUCCEEDED;
  }

  async changePuk(seed) {
    console.log('changePuk');
    if (!seed) { throw new Error('no-passphrase-provided'); }

    console.log('changePuk: decrypting old puk');
    const decryptedPuk = await crypto.aesDecrypt(seed, this.docData.encryptedPuk.salt, this.docData.encryptedPuk.cipherText);
    if (!decryptedPuk || !decryptedPuk.clearText) { throw new Error('puk-failed-decryption'); }

    console.log('changePuk: generating new puk');
    const newPuk = crypto.generateRandomReadableString(consts.YUBIKEY_PUK_LENGTH);

    console.log('changePuk: encrypting new puk');
    const newEncryptedPuk = await crypto.aesEncrypt(seed, newPuk);
    if (!newEncryptedPuk || !newEncryptedPuk.cipherText) { throw new Error('puk-failed-encryption'); }

    console.log('changePuk: setting puk on device');
    const result = await yubikey.setPuk(decryptedPuk.clearText, newPuk);
    if (!result) { throw new Error('failed-to-set-puk'); }

    this.docData.encryptedPuk = {
      cipherText: newEncryptedPuk.cipherText,
      salt: newEncryptedPuk.salt,
    };
    return result;
  }

  async injectKey(userPin, dev9bKey, seedBuf, privateKey, certificate, slotId) {
    await yubikey.importPrivateKey(this.docData.serialNumber, dev9bKey, privateKey, slotId);
    await yubikey.importCertificate(this.docData.serialNumber, dev9bKey, certificate, slotId);
    if (slotId === DeviceSlot.SLOT_9A) {
      this.docData.slot9a = {
        certificate,
      };
    } else if (slotId === DeviceSlot.SLOT_9C) {
      this.docData.slot9c = {
        certificate,
      };
    } else if (slotId === DeviceSlot.SLOT_9D) {
      const encryptedKey = await crypto.aesEncrypt(seedBuf, Buffer.from(privateKey, 'ascii'));
      this.docData.slot9d = {
        certificate,
        privateKey: { ...encryptedKey },
      };
    } else if (slotId === DeviceSlot.SLOT_9E) {
      this.docData.slot9e = {
        certificate,
      };
    }
    return true;
  }

  async changePin(oldPin, newPin) {
    console.log('changePin');
    if (!oldPin || !newPin) { throw new Error('no-pin-provided'); }
    const result = await yubikey.changeUserPin(this.docData.serialNumber, oldPin, newPin);
    return result;
  }

  async resetUserPin(newPin, seed) {
    console.log('resetUserPin');
    if (!seed || !newPin) { throw new Error('no-pin-provided'); }

    console.log('resetUserPin: decrypting puk');
    const decryptedPuk = await crypto.aesDecrypt(
      seed,
      this.docData.encryptedPuk.salt,
      this.docData.encryptedPuk.encryptedData,
    );
    console.log(decryptedPuk);
    if (!decryptedPuk || !decryptedPuk.decryptedData) { throw new Error(consts.MESSAGE_ERROR_AES_DECRYPTION_FAILED); }
    const decodedPuk = Buffer.from(decryptedPuk.decryptedData, 'base64').toString('ascii');
    console.log('resetUserPin: puk decrypted');

    console.log('resetUserPin: resetting pin');
    const result = await yubikey.resetUserPin(this.docData.serialNumber, decodedPuk, newPin);
    return (result && result.pinReset !== undefined) ? result.pinReset : result;
  }

  async verifyUserPin(pin) {
    console.log('verifyUserPin');
    if (!pin) {
      console.log('no pin provided');
      throw new Error(consts.MESSAGE_ERROR_NO_PIN_PROVIDED);
    }
    const result = await yubikey.verifyPin(pin);
    console.log(result);
    if (!result || result.pinVerified === undefined) {
      throw new Error(consts.MESSAGE_ERROR_PIN_VERIFICATION_FAILED);
    }
    return result.pinVerified;
  }

  async decryptData(pin, encryptedData) {
    console.log('decryptData');
    if (!pin) {
      console.log('no pin provided');
      throw new Error(consts.MESSAGE_ERROR_NO_PIN_PROVIDED);
    }
    return await yubikey.decryptData(this.docData.serialNumber, pin, encryptedData);
  }

  async encryptData(dataToEncrypt) {
    console.log('encryptData');
    if (!dataToEncrypt) {
      console.log('no data provided');
      throw new Error(consts.MESSAGE_ERROR_NO_PIN_PROVIDED);
    }
    return await yubikey.encryptData(this.docData.serialNumber, dataToEncrypt);
  }

  async export(seedBuf) {
    const decrypted9bKey = await crypto.aesDecrypt(
      seedBuf,
      Buffer.from(this.docData.slot9b.salt, 'base64'),
      Buffer.from(this.docData.slot9b.encryptedData, 'base64'),
    );
    console.log(decrypted9bKey);
    const decryptedPuk = await crypto.aesDecrypt(
      seedBuf,
      Buffer.from(this.docData.encryptedPuk.salt, 'base64'),
      Buffer.from(this.docData.encryptedPuk.encryptedData, 'base64'),
    );
    console.log(decryptedPuk);
    const decrypted9dKey = await crypto.aesDecrypt(
      seedBuf,
      Buffer.from(this.docData.slot9d.privateKey.salt, 'base64'),
      Buffer.from(this.docData.slot9d.privateKey.encryptedData, 'base64'),
    );
    console.log(decrypted9dKey);
    // console.log(Buffer.from(decryptedPuk.decryptedData, 'base64').toString('ascii'));
    // console.log(Buffer.from(decrypted9bKey.decryptedData, 'base64').toString('ascii'));
    // console.log(Buffer.from(decrypted9dKey.decryptedData, 'base64').toString('ascii'));
    return `Management Key: ${Buffer.from(decrypted9bKey.decryptedData, 'base64').toString()}
PUK: ${Buffer.from(decryptedPuk.decryptedData, 'base64').toString()}
Encryption Certificate:\r\n${this.docData.slot9d.certificate}
Encryption Private Key:\r\n${Buffer.from(decrypted9dKey.decryptedData, 'base64').toString()}`;
  }

  async reencryptKeys(oldSeed, newSeed) {
    if (this.docData.slot9b && this.docData.slot9b.cipherText) {
      const old9bKey = await crypto.aesDecrypt(
        oldSeed,
        this.docData.slot9b.salt,
        this.docData.slot9b.cipherText,
      );
      this.docData.slot9b = await crypto.aesEncrypt(
        newSeed,
        old9bKey.decryptedData,
      );
    }
    if (this.docData.slot9d && this.docData.slot9d.privateKey.cipherText) {
      const old9dKey = await crypto.aesDecrypt(
        oldSeed,
        this.docData.slot9d.privateKey.salt,
        this.docData.slot9d.privateKey.cipherText,
      );
      this.docData.slot9d.privateKey = await crypto.aesEncrypt(
        newSeed,
        old9dKey.decryptedData,
      );
    }
    if (this.docData.encryptedPuk && this.docData.encryptedPuk.cipherText) {
      const oldPuk = await crypto.aesDecrypt(
        oldSeed,
        this.docData.encryptedPuk.salt,
        this.docData.encryptedPuk.cipherText,
      );
      this.docData.encryptedPuk = await crypto.aesEncrypt(
        newSeed,
        oldPuk.decryptedData,
      );
    }
  }
}

export default Device;
