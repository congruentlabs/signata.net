import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
  TextField,
  Button,
  Modal,
  Box,
  ButtonGroup,
} from '@material-ui/core';
import { IconAlternate, SectionHeader } from 'components/molecules';
import { CardPricingStandard, CardBase, Section } from 'components/organisms';
import { useTranslation } from 'react-i18next';
import { generateMnemonic } from 'bip39';
import useLocalStorageState from 'use-local-storage-state';

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
  noPadding: {
    paddingTop: 0,
    paddingBottom: 0,
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


const Setup = ({ className, config, setConfig, isPersistent }) => {
  const classes = useStyles();
  const theme = useTheme();
  // use this component to detect persistence to warn the user if storage is in-memory or not
  const [recoveryPassphrase, setRecoveryPassphrase] = React.useState(generateMnemonic());
  const [importRecoveryPassphrase, setImportRecoveryPassphrase] = React.useState('');

  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();
  };

  const handleClickGenerate = (e) => {
    e.preventDefault();
    const mnemonic = generateMnemonic();
    console.log(mnemonic);
    setRecoveryPassphrase(mnemonic);
  }

  return (
    <div className={className}>
      <Section className={classes.noPadding}>
        <SectionHeader
          title="First Time Set Up"
          subtitle="Before you can use Signata, you must set it up for the first time."
          align="left"
        />
      </Section>
      <Section>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h3">
                  Create New Account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" component="p">
                  If you've never used Signata before, you'll need to create an account, starting with a Recovery Passphrase.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Recovery Passphrase"
                  multiline
                  fullWidth
                  variant="outlined"
                  rows={2}
                  maxRows={4}
                  value={recoveryPassphrase}
                />
              </Grid>
              <Grid item xs={12}>
                <ButtonGroup
                  fullWidth
                  color="secondary"
                >
                  <Button
                    variant="outlined"
                    onClick={handleClickGenerate}
                  >
                    Generate
                  </Button>
                  <Button variant="contained">
                    Create Account
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs={12}>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h3">
                  Import Account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" component="p">
                  If you already use Signata, provide your Recovery Passphrase to get started.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Recovery Passphrase"
                  multiline
                  fullWidth
                  variant="outlined"
                  rows={2}
                  maxRows={4}
                  value={importRecoveryPassphrase}
                  onChange={(e) => setImportRecoveryPassphrase(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Import Account
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Section>
    </div>
  );
};

Setup.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Setup;
