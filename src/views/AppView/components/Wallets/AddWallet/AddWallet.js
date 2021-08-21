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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import {
  supportedAddressTypes,
  KEYPAIR_TYPES,
  generateName,
} from '../../utils';

const AddAddressView = (props) => {
  const {
    onClose,
    isLoading,
    onSubmitAddAddress,
    onSubmitImportAddress,
    errorMessages,
  } = props;

  const [mode, setMode] = useState('add');
  const [name, setName] = useState('');
  const [importData, setImportData] = useState('');
  const [selectedType, setSelectedType] = useState('');

  return (
    <Dialog
      open
      maxWidth="sm"
      fullWidth
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="alert-dialog-title"
    >
      <form onSubmit={mode === 'add' ? (e) => onSubmitAddAddress(e, selectedType, name) : (e) => onSubmitImportAddress(e, selectedType, importData, name)}>
        <DialogTitle id="alert-dialog-title">
          Add or Import Wallet
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Alert severity="info">
                <AlertTitle>Adding or Importing Wallets</AlertTitle>
                {[
                  'If you add a wallet, a new cryptographic seed will be generated and',
                  'encrypted by your Device. If you import a wallet, you will need to provide',
                  'the seed or Wallet Import Format (WIF) or Private Key depending on the address type,',
                  'and the imported keys will be encrypted by your Device.',
                ].join(' ')}
              </Alert>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                size="small"
                variant="filled"
                disabled={isLoading}
                required
              >
                <InputLabel id="select-mode-label">Add or Import</InputLabel>
                <Select
                  labelId="select-mode-label"
                  id="select-mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value || '')}
                >
                  <MenuItem value="add">Add</MenuItem>
                  <MenuItem value="import">Import</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                size="small"
                variant="filled"
                disabled={isLoading}
                required
              >
                <InputLabel id="select-type-label">Address Type</InputLabel>
                <Select
                  labelId="select-type-label"
                  id="select-type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value || '')}
                >
                  {supportedAddressTypes.map((t) => (
                    <MenuItem key={t.key} value={t.value}>{t.text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                size="small"
                variant="filled"
                disabled={isLoading}
                placeholder="My New Address"
                label="Friendly Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {isLoading && (<LinearProgress />)}
            </Grid>
            <Grid item xs={12}>
              {mode === 'import' && selectedType === KEYPAIR_TYPES.ETHEREUM && (
                <TextField
                  label="Hex Private Key"
                  required
                  multiline
                  size="small"
                  variant="filled"
                  placeholder="0102030405060708..."
                  disabled={isLoading}
                  fullWidth
                  rows="4"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
              )}
              {mode === 'import' && selectedType === KEYPAIR_TYPES.XLM && (
                <TextField
                  label="Account Secret"
                  required
                  multiline
                  size="small"
                  placeholder="SAV76USXIJOBM..."
                  variant="filled"
                  disabled={isLoading}
                  fullWidth
                  rows="4"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
              )}
              {mode === 'import' && selectedType === KEYPAIR_TYPES.XRP && (
                <TextField
                  label="Wallet Seed"
                  required
                  multiline
                  size="small"
                  placeholder="sp5fghtJtpUorTwvof1..."
                  variant="filled"
                  disabled={isLoading}
                  fullWidth
                  rows="4"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
              )}
              {mode === 'import'
              && (selectedType !== KEYPAIR_TYPES.ETHEREUM
              && selectedType !== KEYPAIR_TYPES.XRP
              && selectedType !== KEYPAIR_TYPES.XLM) && (
                <TextField
                  label="Wallet Import Format (WIF)"
                  required
                  multiline
                  size="small"
                  variant="filled"
                  placeholder="5HueCGU8rMjxEXxiPuD5BDk..."
                  disabled={isLoading}
                  fullWidth
                  rows="4"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
              )}
            </Grid>

            {selectedType === KEYPAIR_TYPES.BLOCKCYPHER && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  <AlertTitle>BlockCypher Test Address</AlertTitle>
                  {[
                    'The selected address is for the BlockCypher testnet.',
                    'These addresses have no value, and should only be used for testing purposes.',
                    'Using these addresses will still consume transfer tokens.',
                  ].join(' ')}
                </Alert>
              </Grid>
            )}
            {errorMessages && errorMessages.map((err) => (
              <Grid item xs={12} key={err.message}>
                <Alert severity="error">
                  {err.message}
                </Alert>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="secondary"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setName(generateName())}
            color="secondary"
            disabled={isLoading}
          >
            Generate Random Name
          </Button>
          {mode && (
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isLoading}
            >
              {mode === 'add' ? 'Add Wallet' : 'Import Wallet'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

AddAddressView.propTypes = {
  onClose: PropTypes.func,
  isLoading: PropTypes.bool,
  onSubmitAddAddress: PropTypes.func,
  onSubmitImportAddress: PropTypes.func,
  errorMessages: PropTypes.array,
};

export default AddAddressView;
