import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import forge from 'node-forge';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  // Box,
  ButtonGroup,
  Step,
  Stepper,
  StepLabel,
  Radio,
  FormControl,
  LinearProgress,
  // FormLabel,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';
import { useTranslation } from 'react-i18next';
import {
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeedSync,
} from 'bip39';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
  noPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  noPaddingTop: {
    paddingTop: 0,
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};


const AppSetup = ({ className, config, setConfig, isPersistent }) => {
  const classes = useStyles();
  const theme = useTheme();
  // use this component to detect persistence to warn the user if storage is in-memory or not
  const [recoveryPassphrase, setRecoveryPassphrase] = useState(generateMnemonic());
  const [importRecoveryPassphrase, setImportRecoveryPassphrase] = useState('');
  const [wordCount, setWordCount] = useState('12');
  const [setupMode, setSetupMode] = useState('create');
  const [firstConfirm, setFirstConfirm] = useState(false);
  const [secondConfirm, setSecondConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setLoading] = useState(false);

  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleClickGenerate = (e) => {
    e.preventDefault();
    const mnemonic = generateMnemonic();
    setRecoveryPassphrase(mnemonic);
  };

  const handleSubmitCreateAccount = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(undefined);
      
      const seed = mnemonicToSeedSync(recoveryPassphrase.toLowerCase()).toString('hex');
      const computedHash = forge.util.bytesToHex(forge.pkcs5.pbkdf2(seed, '', 10000, 512));
  
      setConfig({ ...config, seedHash: computedHash });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }

  };

  const handleSubmitImportAccount = (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(undefined);
      const isValid = validateMnemonic(importRecoveryPassphrase.toLowerCase());
      const seed = mnemonicToSeedSync(importRecoveryPassphrase).toString('hex');
      const computedHash = forge.util.bytesToHex(forge.pkcs5.pbkdf2(seed, '', 10000, 512));
      if (isValid) {
        setConfig({ ...config, seedHash: computedHash });
      } else {
        setErrorMessage("Invalid Recovery Passphrase. Your passphrase needs to be 12 separate words, and a valid BIP39 mnemonic.")
      }
  
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Section className={classes.noPaddingTop}>
        <SectionHeader
          title="Set Up Recovery Passphrase"
          subtitle="Before you can use Signata, you must set up your recovery passphrase."
          align="left"
        />
        <Stepper orientation={isMd ? "horizontal" : "vertical"}>
          <Step completed={false} active>
            <StepLabel>Set Up Recovery Passphrase</StepLabel>
          </Step>
          <Step completed={false}>
            <StepLabel>Set Up First Device</StepLabel>
          </Step>
        </Stepper>
      </Section>
      <Section className={classes.noPaddingTop}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup row name="mode" onChange={(e) => setSetupMode(e.target.value)} defaultValue="create">
                <FormControlLabel
                  value="create"
                  disabled={isLoading}
                  control={(<Radio color="primary" />)}
                  label="Create New Account"
                  labelPlacement="right"
                />
                <FormControlLabel
                  value="import"
                  disabled={isLoading}
                  control={(<Radio color="primary" />)}
                  label="Import Existing Account"
                  labelPlacement="right"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {setupMode === "create" ? (
              <form onSubmit={handleSubmitCreateAccount}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                      Create New Signata Account
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" component="p" gutterBottom>
                      If you've never used Signata before, you'll need to create an account by generating a new Recovery Passphrase.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Recovery Passphrase"
                      multiline
                      color="secondary"
                      disabled={isLoading}
                      fullWidth
                      variant="outlined"
                      value={recoveryPassphrase}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={firstConfirm}
                          disabled={isLoading}
                          onChange={(e) => setFirstConfirm(e.target.checked)}
                          name="firstConfirm"
                          color="primary"
                        />
                      }
                      label="I acknowledge that I have saved a copy of this Recovery Passphrase somewhere safe, such as stored in a password manager or written on a piece of paper."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={secondConfirm}
                          disabled={isLoading}
                          onChange={(e) => setSecondConfirm(e.target.checked)}
                          name="secondConfirm"
                          color="primary"
                        />
                      }
                      label="I acknowledge that I must NEVER tell anyone this passphrase. I must never tell it to anyone in the Signata team, or anyone pretending to represent Signata. I will treat this passphrase like the password to my online bank account."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ButtonGroup
                      fullWidth
                      color="secondary"
                      orientation={isMd ? "horizontal" : "vertical"}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleClickGenerate}
                        disabled={isLoading}
                      >
                        Generate
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={!firstConfirm || !secondConfirm || isLoading}
                      >
                        Create Account
                      </Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <form onSubmit={handleSubmitImportAccount}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                      Import Signata Account
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" component="p">
                      If you already use Signata, provide your Recovery Passphrase. Don't re-use a Passphase that you've used for other apps, like your MetaMask Secret Recovery Phrase. This passphrase is different.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Recovery Passphrase"
                      multiline
                      color="secondary"
                      disabled={isLoading}
                      fullWidth
                      variant="outlined"
                      value={importRecoveryPassphrase}
                      onChange={(e) => setImportRecoveryPassphrase(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      Import Account
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Grid>
          {isLoading && (
            <Grid item xs={12}>
              <LinearProgress color="secondary" />
            </Grid>
          )}
          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Section>
    </div>
  );
};

AppSetup.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default AppSetup;
