import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
  colors,
  Button,
} from '@material-ui/core';
import { IconAlternate, SectionHeader } from 'components/molecules';
import { CardPricingStandard, CardBase, Section } from 'components/organisms';
import { useTranslation } from 'react-i18next';
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

const Devices = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [devices, setDevices] = useLocalStorageState('devices', []);

  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Section className={classes.noPadding}>
        <SectionHeader
          title="Devices"
          subtitle={''}
          align="left"
        />
      </Section>
      <Section className={classes.noPadding}>
        <Grid container spacing={2}>
          {devices.map((device) => (
            <Grid key={device.id} item xs={12} md={4}>
              <CardPricingStandard
                title="Device"
                subtitle={device.type}
                disclaimer={device.serialNumber}
                cta={(
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    Manage
                  </Button>
                )}
              />
            </Grid>
          ))}
          <Grid item xs={12} md={4}>
            <CardBase>
              <Button
                color="secondary"
                variant={devices.length < 1 ? "contained" : "outlined"}
                fullWidth
              >
                Add New Device
              </Button>
            </CardBase>
          </Grid>
        </Grid>
      </Section>
    </div>
  );
};

Devices.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Devices;
