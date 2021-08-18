export { default as Address } from './Address';
export { default as Device } from './Device';

export const YUBIKEY_ERROR_PIN_CHANGE_GENERIC = 'YUBIKEY_ERROR_PIN_CHANGE_GENERIC';
export const YUBIKEY_ERROR_PIN_CODE_BLOCKED = 'YUBIKEY_ERROR_PIN_CODE_BLOCKED';
export const YUBIKEY_ERROR_PIN_CODE_FAILED = 'YUBIKEY_ERROR_PIN_CODE_FAILED';
export const YUBIKEY_ERROR_PUK_CODE_BLOCKED = 'YUBIKEY_ERROR_PUK_CODE_BLOCKED';
export const YUBIKEY_ERROR_FAILED_CONNECT_READER = 'YUBIKEY_ERROR_FAILED_CONNECT_READER';
export const YUBIKEY_MESSAGE_PUK_CODE_BLOCKED = 'The puk code is blocked';
export const YUBIKEY_MESSAGE_PUK_CODE_FAILED_VERIFY = 'Failed verifying puk code';
export const YUBIKEY_MESSAGE_PIN_CHANGED = 'Successfully changed the pin code';
export const YUBIKEY_MESSAGE_PIN_CODE_BLOCKED = 'pin code is blocked';
export const YUBIKEY_MESSAGE_PIN_CODE_FAILED_VERIFY = 'Failed verifying pin code';
export const YUBIKEY_MESSAGE_PIN_UNBLOCKED = 'Successfully unblocked the pin code';
export const YUBIKEY_MESSAGE_RESET_SUCCESSFUL = 'Successfully reset the application';
export const YUBIKEY_MESSAGE_FAILED_CONNECT_READER = 'Failed to connect to reader';
export const YUBIKEY_MESSAGE_PIN_CODE_VERIFIED = 'Successfully verified';
export const YUBIKEY_MESSAGE_PIN_CODE_VERIFICATION_FAILED = 'Pin verification failed';
export const YUBIKEY_MESSAGE_MGT_KEY_AUTHENTICATION_FAILED = 'Failed authentication with the application';
export const GENERIC_SERVER_ERROR = 'Request failed with status code 500';

export const YUBIKEY_PUK_LENGTH = 8;
export const YUBIKEY_9B_LENGTH = 48;

export const YUBIKEY_DEFAULT_9B_KEY = '010203040506070801020304050607080102030405060708';
export const YUBIKEY_DEFAULT_PUK = '12345678';
export const YUBIKEY_DEFAULT_PIN = '123456';

export const MAX_KEYPAIR_CACHE_AGE = 45 * 60 * 1000; // 45 minutes
export const MAX_DEVICE_CACHE_AGE = 24 * 60 * 60 * 1000; // 1 day

export const NEO_OTP_PID = 'NEO_OTP_PID';
export const NEO_OTP_CCID_PID = 'NEO_OTP_CCID_PID';
export const NEO_CCID_PID = 'NEO_CCID_PID';
export const NEO_U2F_PID = 'NEO_U2F_PID';
export const NEO_OTP_U2F_PID = 'NEO_OTP_U2F_PID';
export const NEO_U2F_CCID_PID = 'NEO_U2F_CCID_PID';
export const NEO_OTP_U2F_CCID_PID = 'NEO_OTP_U2F_CCID_PID';
export const YK4_OTP_PID = 'YK4_OTP_PID';
export const YK4_U2F_PID = 'YK4_U2F_PID';
export const YK4_OTP_U2F_PID = 'YK4_OTP_U2F_PID';
export const YK4_CCID_PID = 'YK4_CCID_PID';
export const YK4_OTP_CCID_PID = 'YK4_OTP_CCID_PID';
export const YK4_U2F_CCID_PID = 'YK4_U2F_CCID_PID';
export const YK4_OTP_U2F_CCID_PID = 'YK4_OTP_U2F_CCID_PID';
export const YUBIKEY_CCID = 'YUBIKEY_CCID';
export const PRODUCT_NOT_SUPPORTED = 'PRODUCT_NOT_SUPPORTED';
export const VENDOR_NOT_SUPPORTED = 'VENDOR_NOT_SUPPORTED';
export const NO_DEVICE_CONNECTED = 'NO_DEVICE_CONNECTED';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
export const Yubikey4 = 'YubiKey 4';
export const Yubikey5 = 'YubiKey 5';
export const Yubikey5A = 'YubiKey 5A';
export const Yubikey5Nfc = 'YubiKey 5 NFC';
export const Yubikey5Nano = 'YubiKey 5 Nano';
export const Yubikey5C = 'YubiKey 5C';
export const Yubikey5CNano = 'YubiKey 5C Nano';
export const YubikeyPreview = 'YubiKey Preview';
export const Yubikey5Ci = 'YubiKey 5Ci';
export const YubikeyFIPS = 'YubiKey FIPS';
export const YubikeyNEO = 'YubiKey NEO';
export const WindowsPC = 'Windows PC';

export const SUPPORTED_DEVICE_TYPES = Object.freeze({
  NEO_OTP_CCID_PID: 'NEO_OTP_CCID_PID',
  NEO_CCID_PID: 'NEO_CCID_PID',
  NEO_U2F_CCID_PID: 'NEO_U2F_CCID_PID',
  NEO_OTP_U2F_CCID_PID: 'NEO_OTP_U2F_CCID_PID',
  Yubikey4: 'YubiKey 4',
  YubikeyNEO: 'YubiKey NEO',
  Yubikey5: 'YubiKey 5',
  Yubikey5A: 'YubiKey 5A',
  Yubikey5Nfc: 'YubiKey 5 NFC',
  Yubikey5Nano: 'YubiKey 5 Nano',
  Yubikey5C: 'YubiKey 5C',
  Yubikey5CNano: 'YubiKey 5C Nano',
  YubikeyPreview: 'YubiKey Preview',
  Yubikey5Ci: 'YubiKey 5Ci',
  YubikeyFIPS: 'YubiKey FIPS',
  YK4_CCID_PID: 'YK4_CCID_PID',
  YK4_OTP_CCID_PID: 'YK4_OTP_CCID_PID',
  YK4_U2F_CCID_PID: 'YK4_U2F_CCID_PID',
  YK4_OTP_U2F_CCID_PID: 'YK4_OTP_U2F_CCID_PID',
  YUBIKEY_CCID: 'YUBIKEY_CCID',
});

export const SUPPORTED_DEVICE_ARRAY = [
  WindowsPC,
  Yubikey4,
  Yubikey5,
  Yubikey5A,
  Yubikey5C,
  Yubikey5CNano,
  Yubikey5Nfc,
  Yubikey5Nano,
  YubikeyPreview,
  Yubikey5Ci,
  YubikeyFIPS,
];

export const defaultConvertedValues = {
  coinIdentifier: 'UNKNOWN',
  error: false,
  fromAddress: '',
  recipientAddress: 'C6htNqwCYy4FFuDH5jGuKz8g4nvGp9UjhP',
  transferAmount: '0.00146484',
  feeInFiat: '0',
  remainingBalance: '0',
  message: 'invalid-data',
  availableBalanceInBitcoin: '0',
  minerFeeInBitcoin: '0',
  transactionAmountInBitcoin: '0',
  allInBitcoin: '0',
  halfInBitcoin: '0',
  totalInBitcoin: '0',
  remainderInBitcoin: '0',
  availableBalanceInFiat: '0.00',
  minerFeeInFiat: '0.00',
  transactionAmountInFiat: '0.00',
  totalInFiat: '0.00',
  remainderInFiat: '0.00',
  availableBalanceInSatoshi: '0',
  minerFeeInSatoshi: '0',
  transactionAmountInSatoshi: '0',
  totalInSatoshi: '0',
  remainderInSatoshi: '0',
};

export const SYMMETRIC_CRYPTO_KEY_LENGTH_BYTES = 32;
export const SYMMETRIC_CRYPTO_SALT_LENGTH = 128;
export const SYMMETRIC_CRYPTO_PBKDF2_ROUNDS = 10000;

export const MIN_PIN_LENGTH = 4;
export const MAX_PIN_LENGTH = 16;

export const MESSAGE_ERROR_RSA_KEY_GEN_FAILED = 'error-rsa-keygen-failed';
export const MESSAGE_ERROR_NO_PASSPHRASE = 'error-no-passphrase';
export const MESSAGE_NO_CERT_FOUND = 'no-cert-found';
export const MESSAGE_ERROR_NO_USER_IN_CACHE = 'error-no-user-in-cache';
export const MESSAGE_ERROR_DEVICE_NOT_CONNECTED = 'error-device-not-connected';
export const MESSAGE_ERROR_DEVICE_MULTIPLE_CONNECTED = 'error-multiple-device-connected';
export const MESSAGE_ERROR_DEVICE_PUK_SET_FAILED = 'error-device-puk-set-failed';
export const MESSAGE_ERROR_DEVICE_MGT_SET_FAILED = 'error-device-mgt-key-set-failed';
export const MESSAGE_ERROR_DEVICE_CCID_DISABLED = 'error-device-ccid-disabled';
export const MESSAGE_ERROR_DEVICE_RESET_CONNECTION = 'error-device-reset-connection';
export const MESSAGE_ERROR_DEVICE_PIV_RESET_FAILED = 'error-device-piv-reset-failed';
export const MESSAGE_ERROR_DEVICE_9B_CHANGE_FAILED = 'error-device-9b-change-failed';
export const MESSAGE_ERROR_DEVICE_PUK_CHANGE_FAILED = 'error-device-puk-change-failed';
export const MESSAGE_DEVICE_INITIALIZE_SUCCEEDED = 'device-initialize-succeeded';
export const MESSAGE_DEVICE_IMPORT_SUCCEEDED = 'device-import-succeeded';
export const MESSAGE_DEVICE_INITIALIZE_FAILED = 'device-initialize-failed';
export const MESSAGE_DEVICE_IMPORT_FAILED = 'device-import-failed';
export const MESSAGE_DEVICE_CHANGE_9B_KEY_SUCCEEDED = 'device-change-9b-key-succeeded';
export const MESSAGE_DEVICE_CHANGE_PIN_SUCCEEDED = 'device-change-pin-succeeded';
export const MESSAGE_DEVICE_CHANGE_PIN_FAILED = 'device-change-pin-failed';
export const MESSAGE_ERROR_DEVICE_DECRYPTION_FAILED = 'error-device-decryption-failed';
export const MESSAGE_ERROR_DEVICE_PIN_BLOCKED = 'error-device-pin-blocked';
export const MESSAGE_ERROR_PIN_CHANGE_FAILED = 'error-device-pin-change-failed';
export const MESSAGE_NO_YUBIKEY_DETECTED = 'error-no-yubikey-connected';
export const MESSAGE_ERROR_INCORRECT_RECOVERY_PASSPHRASE = 'error-incorrect-recovery-passphrase';
export const MESSAGE_ERROR_INCORRECT_PIN = 'error-incorrect-pin';
export const MESSAGE_ERROR_DEVICE_KEY_IMPORT_FAILED = 'error-key-import-failed';
export const MESSAGE_ERROR_DEVICE_KEY_GEN_FAILED = 'error-key-gen-failed';
export const MESSAGE_ERROR_NO_9B_KEY = 'error-no-9b-key';
export const MESSAGE_ERROR_NO_9D_KEY = 'error-no-9d-key';
export const MESSAGE_ERROR_AES_DECRYPTION_FAILED = 'error-aes-decryption-failed';
export const MESSAGE_ERROR_AES_ENCRYPTION_FAILED = 'error-aes-encryption-failed';
export const MESSAGE_ERROR_DECRYPTION_DATA_MISSING = 'error-decryption-data-missing';
export const MESSAGE_ERROR_ENCRYPTION_DATA_MISSING = 'error-encryption-data-missing';
export const MESSAGE_ERROR_MISSING_PRIVATE_KEY = 'error-missing-private-key';
export const MESSAGE_ERROR_INVALID_KEYPAIR_TYPE = 'error-invalid-keypair-type';
export const MESSAGE_ERROR_NO_CSR_INFO = 'error-no-csr-info';
export const MESSAGE_KEY_GENERATED = 'key-generated';
export const MESSAGE_ERROR_NO_KEYPAIR_PROVIDED = 'error-no-keypair-provided';
export const MESSAGE_ERROR_CRYPTO_KEY_GEN_FAILED = 'error-key-gen-failed';
export const MESSAGE_ERROR_CRYPTO_KEY_SIGN_FAILED = 'error-key-sign-failed';
export const MESSAGE_ERROR_FAILED_TO_GET_DEVICE_INFO = 'error-failed-read-device-info';
export const MESSAGE_ERROR_FAILED_TO_GET_PIV_INFO = 'error-failed-read-piv-info';
export const MESSAGE_ERROR_NO_TOKEN = 'no-token';
export const MESSAGE_ERROR_NO_DATA = 'no-data';
export const MESSAGE_ERROR_NO_SALT = 'error-salt-missing';
export const MESSAGE_ERROR_NO_PIN_PROVIDED = 'error-no-pin-provided';
export const MESSAGE_ERROR_PIN_VERIFICATION_FAILED = 'error-pin-verification-failed';
export const MESSAGE_ERROR_KEY_DECRYPTION_FAILED = 'error-key-decryption-failed';
export const MESSAGE_ERROR_NO_TRANSFER_VALUE_PROVIDED = 'error-no-transfer-value';
export const MESSAGE_ERROR_NO_RECIPIENT_ADDRESS_PROVIDED = 'error-no-recipient-address';
export const MESSAGE_ERROR_RECIPIENT_ADDRESS_WRONG_LENGTH = 'error-address-wrong-length';
export const MESSAGE_ERROR_TRANSACTION_REQUEST_FAILED = 'error-transaction-request-failed';
export const MESSAGE_ERROR_SIGNING_FAILED = 'error-signing-failed';
export const MESSAGE_ERROR_VALUE_TOO_LOW = 'error-value-too-low';
export const MESSAGE_ERROR_VALUE_TOO_HIGH = 'error-value-too-high';
export const MESSAGE_ERROR_VALUE_NO_FEE_TOLERANCE = 'error-value-no-fee-tolerance';
export const MESSAGE_ERROR_INVALID_KEY_FORMAT = 'invalid-key-format';
export const MESSAGE_ERROR_INSUFFICIENT_ARGUMENTS = 'insufficient-arguments-provided';
export const MESSAGE_ERROR_DEVICE_PIN_SET_FAILED = 'error-pin-set-failed';

export const YUBIKEY_CONNECTED = 'yubikey-connected';
export const SOFTWARE_CONNECTED = 'software-connected';
export const NONE_CONNECTED = 'none-connected';
