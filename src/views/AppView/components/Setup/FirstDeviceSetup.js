import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';
import { useTranslation } from 'react-i18next';
import {
  Step,
  StepLabel,
  Stepper,
  Grid,
  useMediaQuery,
  Typography,
  Button,
} from '@material-ui/core';

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

const Setup = ({ className }) => {
  const classes = useStyles();
  const theme = useTheme();

  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleClickAddFirstDevice = (e) => {
    e.preventDefault();
    console.log('add device');
  };

  return (
    <div className={className}>
      <Section className={classes.noPadding}>
        <SectionHeader
          title="Set Up First Device"
          subtitle="Now you must set up a Device for your account."
          align="left"
        />
        <Stepper orientation={isMd ? "horizontal" : "vertical"}>
          <Step completed>
            <StepLabel>Set Up Recovery Passphrase</StepLabel>
          </Step>
          <Step completed={false} active>
            <StepLabel>Set Up First Device</StepLabel>
          </Step>
        </Stepper>
      </Section>
      <Section>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h3">
              Adding Devices
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="p" gutterBottom>
              A device is what you use to protect your Signata account. We recommend using a YubiKey, but if you don't have
              one you can just use your computer for now and then upgrade to a YubiKey later.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={handleClickAddFirstDevice}
            >
              Add First Device
            </Button>
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
