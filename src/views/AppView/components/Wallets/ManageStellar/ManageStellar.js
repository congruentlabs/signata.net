import React from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { shell } from 'electron';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
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
  KEYPAIR_TYPES,
} from '../../utils';
import {
  calculateFee,
  toBitcoin,
  toSatoshi,
  subtractSatoshi,
  sumSatoshi,
  isGreaterThan,
} from '../../utils/utilities';

const ManageBtcView = (props) => {
  const {
    onClose,
    isLoading,
    onClickDelete,
    selectedAddress,
    errorMessages,
    onClickSubmitRename,
    onClickCopy,
    onClickSubmitTxnRequest,
    onClickConfirmTxnRequest,
    shared,
    transactionSuccess,
    transactionData,
    exportData,
    onSubmitExport,
    onCopyExportData,
    bgColor,
  } = props;

  const [name, setName] = React.useState(selectedAddress.friendlyName || '');
  const [addressData, setAddressData] = React.useState({});
  const [isLoadingLocal, setLoadingLocal] = React.useState(false);
  const [destinationAddress, setDestinationAddress] = React.useState('');
  const [transferAmount, setTransferAmount] = React.useState(0);
  const [readableTransferAmount, setReadableTransferAmount] = React.useState(0);
  const [showInsufficientValue, setShowInsufficientValue] = React.useState(false);
  const [isFeeError, setFeeError] = React.useState(false);
  const [isAmountError, setAmountError] = React.useState(false);
  const [withdrawPin, setWithdrawPin] = React.useState('');
  const [exportPin, setExportPin] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [readableFee, setReadableFee] = React.useState('');
  const [totalReadableAmount, setTotalReadableAmount] = React.useState('');
  const [readableBalance, setReadableBalance] = React.useState('');

  const handleClickPrefill = (e, half) => {
    e.preventDefault();

    if (!addressData.balance || addressData.balance <= 0) {
      setShowInsufficientValue(true);
    }
    const minusFees = subtractSatoshi(half ? (addressData.balance / 2) : addressData.balance, fee);

    setReadableTransferAmount(toBitcoin(minusFees));
  };

  async function fetchData() {
    setLoadingLocal(true);
    const response = await Axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${selectedAddress.address}`);
    console.log(response.data);
    setAddressData(response.data);
    setLoadingLocal(false);
  }

  React.useEffect(() => {
    if (Number.isNaN(readableFee)) {
      setFeeError(true);
    } else {
      setFee(toSatoshi(readableFee));
    }
  }, [readableFee]);

  React.useEffect(() => {
    if (Number.isNaN(readableTransferAmount)) {
      setAmountError(true);
    } else {
      const satoshiAmount = toSatoshi(readableTransferAmount);
      setTransferAmount(satoshiAmount);
      const sum = sumSatoshi(satoshiAmount, fee || 0);
      setTotalReadableAmount(toBitcoin(sum));
      setAmountError(isGreaterThan(sum, addressData.balance || 0));
    }
  }, [
    setAmountError,
    fee,
    readableTransferAmount,
    selectedAddress.addressType,
    addressData.balance,
  ]);

  React.useEffect(() => {
    let foundFee;
    switch (selectedAddress.addressType) {
      case KEYPAIR_TYPES.BITCOIN:
        foundFee = shared.find((i) => i.id === 'bitcoin-blockcypher');
        break;
      default:
        break;
    }

    if (foundFee) {
      const calculatedFee = calculateFee(foundFee.data.low_fee_per_kb);
      setFee(calculatedFee);
      setReadableFee(toBitcoin(calculatedFee));
      setReadableBalance(toBitcoin(addressData.balance));
    }
  }, [
    shared,
    addressData.balance,
    selectedAddress.addressType,
  ]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleClickBlockExplorer = (e) => {
    e.preventDefault();
    shell.openExternal(`https://live.blockcypher.com/btc/address/${selectedAddress.address}/`);
  };

  const handleClickRefresh = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <Dialog
      open
      maxWidth="md"
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        Manage BTC Address {name}
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
                <QRCode value={`bitcoin:${selectedAddress.address}`} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>
                  Balance: {readableBalance || 0} BTC
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
            <Typography>Withdraw BTC</Typography>
          </AccordionSummary>
          <form onSubmit={!transactionData ? (e) => onClickSubmitTxnRequest(e, destinationAddress, transferAmount, fee, withdrawPin) : onClickConfirmTxnRequest}>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    autoFocus
                    size="small"
                    variant="filled"
                    placeholder="1KyE49uPB..."
                    label="Destination Address"
                    value={destinationAddress}
                    disabled={isLoading || isLoadingLocal}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                  />
                  {isLoading && (<LinearProgress />)}
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p" variant="body2">
                    Provide the amount of BTC you wish to send. A transaction fee (calculated by the bitcoin
                    network, not Signata) is also required. We will provide a recommended fee
                    calculated from the current average in the network. If you choose to change the
                    recommended fee you do so at your own risk as your transaction may fail to be processed.
                    A failed transaction will still consume a Signata Transfer Token.
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
                    label="Amount to send in BTC"
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
                    label="Transaction fee in BTC"
                    value={readableFee}
                    disabled={isLoading || isLoadingLocal}
                    onChange={(e) => setReadableFee(e.target.value)}
                  />
                </Grid>
                {showInsufficientValue && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      <AlertTitle>Not enough currency on your address</AlertTitle>
                      Please make sure your address has enough value to make a transfer,
                      including enough value to cover the network fees for the transaction.
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Alert severity={(isAmountError || showInsufficientValue) ? 'error' : 'success'}>
                    <AlertTitle>Total to Transfer</AlertTitle>
                    {totalReadableAmount} BTC
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
                {transactionData && !transactionSuccess && (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="info">
                        <AlertTitle>Transaction Request Created</AlertTitle>
                        Your transaction request has been created. Please check the transaction
                        details are correct before clicking Submit Request. Once your request has been
                        submitted the transaction will be digitally signed by your keys, and one of
                        your transfer tokens will be consumed by Signata. The actual time it takes
                        for your transaction to be processed depends on the network type and how much
                        traffic is currently affecting the network.
                      </Alert>
                    </Grid>
                    <Grid item xs={12}>
                      <List>
                        {transactionData.tx.inputs.map((input) => (
                          <ListItem key={input.sequence}>
                            <ListItemAvatar>
                              <Avatar>
                                <ArrowRightAltIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="From Addresses" secondary={JSON.stringify(input.addresses)} />
                          </ListItem>
                        ))}
                        {transactionData.tx.outputs.map((output) => (
                          <ListItem key={output.value}>
                            <ListItemAvatar>
                              <Avatar>
                                <KeyboardBackspaceIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="To Addresses" secondary={JSON.stringify(output.addresses)} />
                          </ListItem>
                        ))}
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <AttachMoneyIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Transaction Total" secondary={toBitcoin(transactionData.tx.total)} />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <AttachMoneyIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Transaction Fees Included" secondary={toBitcoin(transactionData.tx.fees)} />
                        </ListItem>
                      </List>
                      {isLoading && (<LinearProgress />)}
                    </Grid>
                  </>
                )}
                {transactionSuccess && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      <AlertTitle>Transaction Submitted!</AlertTitle>
                      Your transaction has been submitted to the network. Depending on
                      network congestion it can take 15 minutes or more for the transaction
                      to be confirmed.
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
                      {!transactionData ? 'Request Transaction' : 'Submit Request'}
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
            <Typography>Export WIF</Typography>
          </AccordionSummary>
          <form onSubmit={isLoading ? undefined : (e) => onSubmitExport(e, exportPin)}>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity="warning">
                    <AlertTitle>Exporting Addresses</AlertTitle>
                    You can export your address at any time. This will reveal your address
                    WIF and private key, so if you need to export your address please ensure you
                    save it somewhere safe, such as within a password-protected vault. If someone
                    sees your WIF or Private Key they can take control of your address. Signata
                    staff will never ask to see your WIF or Private Keys.
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
                      Export Address
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
  onClickConfirmTxnRequest: PropTypes.func,
  onClickCopy: PropTypes.func,
  onClickDelete: PropTypes.func,
  onClickSubmitRename: PropTypes.func,
  onClickSubmitTxnRequest: PropTypes.func,
  bgColor: PropTypes.string,
  onClose: PropTypes.func,
  selectedAddress: PropTypes.object,
  shared: PropTypes.array,
  transactionData: PropTypes.object,
  transactionSuccess: PropTypes.bool,
  onSubmitExport: PropTypes.func,
  onCopyExportData: PropTypes.func,
  exportData: PropTypes.string,
};

export default ManageBtcView;
