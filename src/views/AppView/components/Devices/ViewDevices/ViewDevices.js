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

const ViewDevices = ({ className, disabled, devices, setDevices, config, setShowAddDevice, setShowManageDevice, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const { t } = useTranslation();

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleClickAddDevice = (e) => {
    e.preventDefault();
    setShowAddDevice(true);
  };

  const handleClickManageDevice = (e) => {
    e.preventDefault();
    setShowManageDevice(true);
  };


  return (
    <div className={className} {...rest}>
      <Section className={classes.noPadding}>
        <SectionHeader
          align="left"
          title={t('Devices')}
          // subtitle={t('')}
        />
      </Section>
      <Section className={classes.noPadding}>
        <Grid container spacing={2}>
          {devices.map((device) => (
            <Grid key={device.id} item xs={12} md={4}>
              <CardPricingStandard
                title={t('Device')}
                subtitle={device.type}
                disclaimer={device.serialNumber}
                cta={(
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={handleClickManageDevice}
                  >
                    {t('Manage Device')}
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
                disabled={disabled}
                onClick={handleClickAddDevice}
              >
                {t('Add Device')}
              </Button>
            </CardBase>
          </Grid>
        </Grid>
      </Section>
    </div>
  );
};

ViewDevices.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default ViewDevices;
