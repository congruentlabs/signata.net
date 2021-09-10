import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useTheme } from '@material-ui/styles';
import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  useMediaQuery,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const AddDevice = ({
  errorMessages,
  isLoading,
  newPin,
  newPinRepeated,
  onClose,
  onSubmit,
  recoveryPassphrase,
  setNewPin,
  setNewPinRepeated,
  setRecoveryPassphrase,
}) => {
  const theme = useTheme();

  const [importDeviceEnabled, setImportDeviceEnabled] = useState(false);
  const [existing9BKey, setExisting9BKey] = useState('');
  const [existingPuk, setExistingPuk] = useState('');
  const [addDeviceMode, setAddDeviceMode] = useState('password');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const onSubmitPassword = () => {
    
  };
  
  const onSubmitHardware = () => {
    
    // importDeviceEnabled, existing9BKey, existingPuk
  };

  return (
    <form onSubmit={addDeviceMode === 'password' ? onSubmitPassword : onSubmitHardware}>
      <Dialog
        open
        fullScreen={!isMd}
        onClose={isLoading ? undefined : onClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
          Add New Device
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <FormControl component="fieldset">
                <RadioGroup row name="mode" onChange={(e) => setAddDeviceMode(e.target.value)} defaultValue="password">
                  <FormControlLabel
                    value="password"
                    disabled={isLoading}
                    control={(<Radio color="primary" />)}
                    label="Use Password"
                    labelPlacement="right"
                  />
                  <FormControlLabel
                    value="hardware"
                    disabled={isLoading}
                    control={(<Radio color="secondary" />)}
                    label="Use Hardware"
                    labelPlacement="right"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {addDeviceMode === "password" && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Alert severity="info">
                    <AlertTitle>Using a Password</AlertTitle>
                    Set a password to unlock your Signata account. We recommend using a
                    YubiKey for stronger protection of your account, but if you
                    don't have a YubiKey you can use a password until you get one.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="warning">
                    <AlertTitle>Password Security</AlertTitle>
                    Your account is only as strong as your password, and as secure
                    as the computer you use it on. We recommend using a password manager
                    to generate and safely store your password, and using a computer
                    that is kept up to date and with anti-malware enabled to keep your
                    account secure.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Password"
                    color="secondary"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Repeat Password"
                    color="secondary"
                    disabled={isLoading}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            )}
            {addDeviceMode === "hardware" && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Alert severity="info">
                    <AlertTitle>Adding or Importing Your Device</AlertTitle>
                    Provide your Recovery Passphrase, your desired PIN, insert your
                    YubiKey, and click &quot;Add Device&quot;.
                  </Alert>
                </Grid>
                {!importDeviceEnabled ? (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      <AlertTitle>Adding Devices</AlertTitle>
                      The first YubiKey found connected to your computer will be added to Signata.
                      The PIV (smart card) part of your YubiKey will be reset,
                      deleting any configuration that you may have already set on it.
                    </Alert>
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="warning">
                        <AlertTitle>Importing Devices</AlertTitle>
                        The first YubiKey found connected to your computer will be imported into Signata.
                        If you&apos;ve already configured your device before and you want to keep using keys that
                        you set, then you can provide your existing keys instead. Please note that
                        you <b>must</b> provide correct key values when importing your device - we
                        will test that they&apos;re correct as we import your device. If the values your provide are
                        incorrect, then too many failed attempts to use them will lock your device
                        and it will need to be initialized, wiping all the keys you have stored in the
                        PIV (smart card) part of your device.
                      </Alert>
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="warning">
                        <AlertTitle>Importing Devices</AlertTitle>
                        Any encryption key stored on your YubiKey (the 9D slot) will still be overwritten by this
                        import process.
                      </Alert>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={importDeviceEnabled}
                        onChange={() => setImportDeviceEnabled(!importDeviceEnabled)}
                        color="primary"
                      />
                    )}
                    label="Import Existing Device"
                  />
                </Grid>
                {importDeviceEnabled ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Recovery Passphrase"
                        placeholder="nitwit blubber oddment tweak..."
                        disabled={isLoading}
                        value={recoveryPassphrase}
                        onChange={(e) => setRecoveryPassphrase(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Existing PIN"
                        type="password"
                        disabled={isLoading}
                        value={newPin}
                        onChange={(e) => { setNewPin(e.target.value); setNewPinRepeated(e.target.value); }} // we set both here so it won't trip the check that they're the same
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Existing 9B (Management) Key"
                        disabled={isLoading}
                        value={existing9BKey}
                        onChange={(e) => setExisting9BKey(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Existing PUK"
                        disabled={isLoading}
                        value={existingPuk}
                        onChange={(e) => setExistingPuk(e.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Recovery Passphrase"
                        placeholder="nitwit blubber oddment tweak..."
                        disabled={isLoading}
                        value={recoveryPassphrase}
                        onChange={(e) => setRecoveryPassphrase(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New PIN"
                        type="password"
                        disabled={isLoading}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New PIN Repeated"
                        type="password"
                        disabled={isLoading}
                        value={newPinRepeated}
                        onChange={(e) => setNewPinRepeated(e.target.value)}
                      />
                    </Grid>
                  </>
                )}

                {errorMessages && errorMessages.map((err) => (
                  <Grid item xs={12} key={err.id}>
                    <Alert severity="error">
                      <AlertTitle>{err.code}</AlertTitle>
                      {err.message}
                    </Alert>
                  </Grid>
                ))}
                {isLoading && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <AlertTitle>Adding Device</AlertTitle>
                      Your device is being reset and added to Signata. Please wait
                      until this process completes, and do not remove your device until
                      this process has finished, otherwise your device could be damaged.
                    </Alert>
                    <LinearProgress />
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isLoading}
            startIcon={<AddIcon />}
          >
            Add Device
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

AddDevice.propTypes = {
  setNewPinRepeated: PropTypes.func,
  setRecoveryPassphrase: PropTypes.func,
  setNewPin: PropTypes.func,
  newPinRepeated: PropTypes.string,
  newPin: PropTypes.string,
  recoveryPassphrase: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  errorMessages: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default AddDevice;
