import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';

// import { SELECT_DEVICE } from '../lib/messages';

function AddDeviceView(props) {
  const {
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
  } = props;

  const [importDeviceEnabled, setImportDeviceEnabled] = useState(false);
  const [existing9BKey, setExisting9BKey] = useState('');
  const [existingPuk, setExistingPuk] = useState('');

  return (
    <Dialog
      open
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="alert-dialog-title"
    >
      <form onSubmit={(e) => onSubmit(e, importDeviceEnabled, existing9BKey, existingPuk)}>
        <DialogTitle id="alert-dialog-title">
          Add New Device
        </DialogTitle>
        <DialogContent>
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
                    variant="filled"
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
                    variant="filled"
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
                    variant="filled"
                    disabled={isLoading}
                    value={existing9BKey}
                    onChange={(e) => setExisting9BKey(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Existing PUK"
                    variant="filled"
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
                    variant="filled"
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
                    variant="filled"
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
                    variant="filled"
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="secondary"
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isLoading}
          >
            Add Device
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AddDeviceView.propTypes = {
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

export default AddDeviceView;
