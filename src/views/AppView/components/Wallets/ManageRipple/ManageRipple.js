import React from 'react';
import Big from 'big.js';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { RippleAPI } from 'ripple-lib';
import { shell } from 'electron';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WidgetsIcon from '@material-ui/icons/Widgets';

import {
  generateName,
} from '../../utils';
import { Address } from '../../lib/classes';

const rippleApi = new RippleAPI({ server: 'wss://s1.ripple.com' });

rippleApi.on('error', (code, msg) => {
  console.log(`${code}: ${msg}`);
});

rippleApi.on('connected', () => {
  console.log('connected to ripple');
});

const ManageBtcView = (props) => {
  const {
    onClose,
    isLoading,
    onClickDelete,
    selectedAddress,
    errorMessages,
    setErrorMessages,
    onClickSubmitRename,
    onClickCopy,
    exportData,
    onSubmitExport,
    onCopyExportData,
    bgColor,
  } = props;

  const [name, setName] = React.useState(selectedAddress.friendlyName || '');
  const [isLoadingLocal, setLoadingLocal] = React.useState(false);
  const [exportPin, setExportPin] = React.useState('');
  const [transactionSuccess, setTransactionSuccess] = React.useState(false);
  const [readableTransferAmount, setReadableTransferAmount] = React.useState('');
  const [transactionData, setTransactionData] = React.useState(undefined);
  const [xrpFee, setXrpFee] = React.useState('');
  const [destinationAddress, setDestinationAddress] = React.useState('');
  const [isAmountError, setAmountError] = React.useState(false);
  const [isFeeError, setFeeError] = React.useState(false);
  const [withdrawPin, setWithdrawPin] = React.useState('');
  const [tag, setTag] = React.useState('');
  const [showInsufficientValue, setShowInsufficientValue] = React.useState(false);
  const [totalReadableAmount, setTotalReadableAmount] = React.useState('');
  const [transferAmount, setTransferAmount] = React.useState(0);
  const [feesInDrops, setFeesInDrops] = React.useState('');
  const [transferAmountInDrops, setTransferAmountInDrops] = React.useState('');
  const [knownValueInDrops, setKnownValueInDrops] = React.useState('');

  const handleClickPrefill = (e, half) => {
    e.preventDefault();

    if (!knownValueInDrops || Big(knownValueInDrops).lte(20)) {
      setShowInsufficientValue(true);
    }
    if (half) {
      const minusFees = Big(knownValueInDrops).div(2).minus(Big(feesInDrops));
      setTransferAmount(dropsToXrp(minusFees));
    } else {
      const minusFees = Big(knownValueInDrops).minus(Big(feesInDrops));
      setTransferAmount(dropsToXrp(minusFees));
    }
  };

  const dropsToXrp = (toConvert) => new BigNumber(new BigNumber(toConvert).toString(10)).dividedBy(1000000.0).toString(10);

  const xrpToDrops = (toConvert) => new BigNumber(new BigNumber(toConvert).toString(10))
    .times(1000000.0)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString(10);

  React.useEffect(() => {
    const refreshValue = async () => {
      setLoadingLocal(true);
      await rippleApi.connect();
      const rippleFee = await rippleApi.getFee();
      console.log(rippleFee);
      setXrpFee(rippleFee);

      const balances = await rippleApi.getBalances(selectedAddress.address);
      console.log(balances);

      balances.forEach((b) => {
        if (b.currency === 'XRP') {
          setKnownValueInDrops(xrpToDrops(b.value));
        }
      });

      setLoadingLocal(false);
    };

    refreshValue();
  }, [selectedAddress.address]);

  React.useEffect(() => {
    try {
      setKnownValueInDrops(xrpToDrops(selectedAddress.knownValue));
    } catch {
      setFeeError(true);
    }
  }, [selectedAddress.knownValue]);

  React.useEffect(() => {
    try {
      setFeesInDrops(xrpToDrops(xrpFee));
    } catch {
      setFeeError(true);
    }
  }, [xrpFee]);

  React.useEffect(() => {
    try {
      setTransferAmountInDrops(xrpToDrops(transferAmount));
    } catch {
      setAmountError(true);
    }
  }, [transferAmount]);

  React.useEffect(() => {
    try {
      const sum = Big(transferAmountInDrops).plus(Big(feesInDrops));
      setTotalReadableAmount(dropsToXrp(sum));
      setAmountError(sum.gt(Big(xrpToDrops(selectedAddress.knownValue))));
    } catch {
      setAmountError(true);
    }
  }, [
    setAmountError,
    xrpFee,
    setTotalReadableAmount,
    feesInDrops,
    transferAmountInDrops,
    transferAmount,
    selectedAddress.knownValue,
  ]);

  const handleClickSubmitXrpTxnRequest = async (e) => {
    e.preventDefault();
    try {
      setLoadingLocal(true);
      setErrorMessages([]);
      setTransactionSuccess(false);
      setTransactionData(undefined);

      // decrypt the private key first, as we don't want to submit requests unless the user
      // actually has their device available and the correct PIN
      const addr = new Address(selectedAddress);
      const exportedAddress = await addr.export(withdrawPin);
      console.log(exportedAddress);

      await rippleApi.connect();
      const paymentObject = {
        source: {
          address: selectedAddress.address,
          maxAmount: {
            currency: 'drops',
            value: transferAmountInDrops,
          },
        },
        destination: {
          address: destinationAddress,
          amount: {
            currency: 'drops',
            value: transferAmountInDrops,
          },
        },
      };

      if (tag) {
        paymentObject.destination.tag = tag;
      }

      const preparedPayment = await rippleApi.preparePayment(selectedAddress.address, paymentObject);
      console.log(preparedPayment);
      // in this case we use the seed property of the private key, because that's how we store XRP addresses
      const signedTransaction = await rippleApi.sign(preparedPayment.txJSON, exportedAddress.seed);
      console.log(signedTransaction);
      // send it
      const submittedTransaction = await rippleApi.submit(signedTransaction.signedTransaction);
      console.log(submittedTransaction);

      if (submittedTransaction.resultCode === 'tesSUCCESS' || submittedTransaction.resultCode === 'terQUEUED') {
        setTransactionSuccess(true);
      } else {
        setErrorMessages([{ message: submittedTransaction.resultMessage }]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessages(error.errors ? error.errors : [{ message: error.message }]);
    } finally {
      rippleApi.disconnect();
      setLoadingLocal(false);
    }
  };

  // React.useEffect(() => {
  //   fetchData();
  // }, []);

  const handleClickBlockExplorer = (e) => {
    e.preventDefault();
    shell.openExternal(`https://xrpscan.com/account/${selectedAddress.address}/`);
  };

  // const handleClickRefresh = (e) => {
  //   e.preventDefault();
  //   fetchData();
  // };

  return (
    <Dialog
      open
      maxWidth="md"
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        Manage XRP Address {name}
      </DialogTitle>
      <DialogContent style={{ backgroundColor: bgColor }}>
        <Accordion
          defaultExpanded
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Address Overview</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  {selectedAddress.address}
                </Typography>
                <QRCode value={`${selectedAddress.address}`} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>
                  Balance: {readableBalance || 0} XRP
                </Typography>
                <Typography color="textSecondary">
                  Total Received: {addressData.total_sent || 0} BTC
                </Typography>
                <Typography color="textSecondary">
                  Total Sent: {addressData.total_sent || 0} BTC
                </Typography>
                <Typography color="textSecondary">
                  Unconfirmed Balance: {addressData.unconfirmed_balance || 0} BTC
                </Typography>
                <Typography color="textSecondary">
                  Final Balance: {addressData.final_balance || 0} BTC
                </Typography>
                {(isLoading || isLoadingLocal) && (<LinearProgress />)}
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <ButtonGroup size="small" variant="contained">
                  <Button
                    onClick={(e) => onClickCopy(e, selectedAddress)}
                    disabled={isLoading || isLoadingLocal}
                    startIcon={<FileCopyIcon />}
                  >
                    Copy Address
                  </Button>
                  <Button
                    onClick={handleClickRefresh}
                    disabled={isLoading || isLoadingLocal}
                    startIcon={<RefreshIcon />}
                  >
                    Refresh Balance
                  </Button>
                  <Button
                    onClick={handleClickBlockExplorer}
                    disabled={isLoading || isLoadingLocal}
                    startIcon={<WidgetsIcon />}
                  >
                    Block Explorer
                  </Button>
                  <Button
                    disabled={isLoading || isLoadingLocal}
                    startIcon={<DeleteIcon />}
                    onClick={(e) => onClickDelete(e, selectedAddress)}
                  >
                    Delete Address
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Address Name</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  variant="filled"
                  placeholder="New Name"
                  label="Address Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || isLoadingLocal}
                />
                {isLoading && (<LinearProgress />)}
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <ButtonGroup size="small" variant="contained">
                  <Button
                    onClick={() => setName(generateName())}
                    startIcon={<RefreshIcon />}
                    disabled={isLoading || isLoadingLocal}
                  >
                    Generate Random Name
                  </Button>
                  <Button
                    onClick={(e) => onClickSubmitRename(e, name)}
                    startIcon={<SaveIcon />}
                    disabled={isLoading || isLoadingLocal}
                  >
                    Save Name
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>Withdraw XRP</Typography>
          </AccordionSummary>
          <form onSubmit={!transactionSuccess ? handleClickSubmitXrpTxnRequest : undefined}>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    autoFocus
                    size="small"
                    variant="filled"
                    placeholder="rKyE49uPB..."
                    label="Destination Address"
                    value={destinationAddress}
                    disabled={isLoading || isLoadingLocal}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                  />
                  {isLoading && (<LinearProgress />)}
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p" variant="body2">
                    Destination Tag (only provide this if instructed by the receiver):
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="filled"
                    placeholder=""
                    label="Destination Tag (Optional)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="warning">
                    <AlertTitle>Important Ripple Network Information</AlertTitle>
                    The Ripple network will collect a transaction fee which is specified below.
                    This fee is not set by Signata.
                    Also please note that you must keep 20 XRP on your address, and attempting to
                    make a transaction that would leave your address with less than 20 XRP will fail
                    and you will still lose the transaction fee.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p" variant="body2">
                    Provide the amount of XRP you wish to send. Unlike other coins in Signata, XRP
                    transactions are immediately submitted to the network, so
                    please check the destination address and amount is correct before you
                    click &apos;Sign & Submit Request&apos;.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    variant="filled"
                    error={isAmountError}
                    placeholder="0.002"
                    label="Amount to send in XRP"
                    value={readableTransferAmount}
                    disabled={isLoading || isLoadingLocal}
                    onChange={(e) => setReadableTransferAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    variant="filled"
                    error={isFeeError}
                    placeholder="0.002"
                    label="Transaction fee in XRP"
                    value={xrpFee}
                    disabled={isLoading || isLoadingLocal}
                  />
                </Grid>
                {isAmountError && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      <AlertTitle>Invalid transfer amount</AlertTitle>
                      Please check the transfer amount is correct. Please note that
                      at least 20 XRP must be left on your address to keep it active on
                      the Ripple ledger.
                    </Alert>
                  </Grid>
                )}
                {showInsufficientValue && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      <AlertTitle>Not enough XRP in your address</AlertTitle>
                      Please make sure your address has enough XRP to make a transfer,
                      including enough value to cover the transaction fee.
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Alert severity={(isAmountError || showInsufficientValue) ? 'error' : 'success'}>
                    <AlertTitle>Total to Transfer</AlertTitle>
                    {totalReadableAmount} XRP
                  </Alert>
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <ButtonGroup size="small" variant="contained">
                    <Button
                      onClick={(e) => handleClickPrefill(e, false)}
                      disabled={isLoading || isLoadingLocal}
                    >
                      Transfer All
                    </Button>
                    <Button
                      onClick={(e) => handleClickPrefill(e, true)}
                      disabled={isLoading || isLoadingLocal}
                    >
                      Transfer Half
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p" variant="body2">
                    Please insert your device and provide the PIN for it to authorise
                    the withdrawal request:
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="password"
                    variant="filled"
                    label="Device PIN"
                    value={withdrawPin}
                    disabled={isLoading || isLoadingLocal}
                    onChange={(e) => setWithdrawPin(e.target.value)}
                  />
                  {isLoading && (<LinearProgress />)}
                </Grid>
                {errorMessages && errorMessages.map((errorMessage) => (
                  <Grid item xs={12} key={errorMessage.message}>
                    <Alert severity="error">
                      {errorMessage.message}
                    </Alert>
                  </Grid>
                ))}
                {transactionSuccess && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      <AlertTitle>Transaction Submitted!</AlertTitle>
                      Your transaction has been submitted to the Ripple network. Depending on
                      network congestion it may take up to 15 minutes for the transaction
                      to be confirmed. Please use the &apos;Block Explorer&apos; function
                      on your address if you want to watch your transaction progress.
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <ButtonGroup size="small" variant="contained">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isLoading || isAmountError || transactionSuccess}
                    >
                      Sign & Submit Request
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </AccordionDetails>
          </form>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4a-content"
            id="panel4a-header"
          >
            <Typography>Export Private Key</Typography>
          </AccordionSummary>
          <form onSubmit={isLoading ? undefined : (e) => onSubmitExport(e, exportPin)}>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity="warning">
                    <AlertTitle>Exporting Addresses</AlertTitle>
                    You can export your address at any time. This will reveal your address
                    private key, so if you need to export your address please ensure you
                    save it somewhere safe, such as within a password-protected vault. If someone
                    sees your Private Key they can take control of your address. Signata
                    staff will never ask to see your Private Keys.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info">
                    Please insert your device and provide your PIN to export your address.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    variant="filled"
                    disabled={isLoading}
                    type="password"
                    label="Device PIN"
                    value={exportPin}
                    onChange={(e) => setExportPin(e.target.value)}
                  />
                  {isLoading && (<LinearProgress />)}
                </Grid>
                {exportData && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="exported-data"
                      label="Exported Data"
                      multiline
                      rows={4}
                      defaultValue={exportData}
                      variant="outlined"
                    />
                  </Grid>
                )}
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <ButtonGroup size="small" variant="contained">
                    {exportData && (
                      <Button
                        onClick={onCopyExportData}
                        color="secondary"
                        disabled={isLoading}
                      >
                        Copy Export Data
                      </Button>
                    )}
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      startIcon={<ImportExportIcon />}
                      disabled={exportData !== '' || isLoading}
                    >
                      Export XRP Address
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </AccordionDetails>
          </form>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          variant="contained"
          disabled={isLoading || isLoadingLocal}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ManageBtcView.propTypes = {
  errorMessages: PropTypes.array,
  isLoading: PropTypes.bool,
  onClickCopy: PropTypes.func,
  onClickDelete: PropTypes.func,
  onClickSubmitRename: PropTypes.func,
  bgColor: PropTypes.string,
  onClose: PropTypes.func,
  selectedAddress: PropTypes.object,
  onSubmitExport: PropTypes.func,
  onCopyExportData: PropTypes.func,
  setErrorMessages: PropTypes.func,
  exportData: PropTypes.string,
};

export default ManageBtcView;
