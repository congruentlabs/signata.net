import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useMediaQuery, Grid, Typography, Button } from '@material-ui/core';
import { Icon, LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardPricingStandard } from 'components/organisms';
import { GetApp, Launch } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  fontWeight900: {
    fontWeight: 900,
  },
}));

const Pricings = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Pricing"
        subtitle="Add on only what you need."
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardPricingStandard
            variant="outlined"
            withShadow
            liftUp
            title="Signata Standard"
            subtitle="Totally free, forever"
            priceComponent={
              <div>
                <Typography
                  variant="h3"
                  component="span"
                  className={classes.fontWeight900}
                >
                  $0
                </Typography>
              </div>
            }
            features={[
              'Unlimited Identities',
              'Unlimited Wallets',
              'Unlimited Devices',
              'Unlimited Secure Notes',
            ]}
            featureCheckComponent={
              <Icon
                fontIconClass="far fa-check-circle"
                fontIconColor={theme.palette.secondary.main}
              />
            }
            cta={
              <Button
                color="primary"
                variant="contained"
                fullWidth
                size="large"
                href="/download"
                startIcon={<GetApp />}
              >
                Download Now
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardPricingStandard
            variant="outlined"
            title="Cloud Backup"
            liftUp
            subtitle="Keep your data safe"
            priceComponent={
              <div>
                <Typography
                  variant="h3"
                  component="span"
                  className={classes.fontWeight900}
                >
                  20 SATA 
                </Typography>
                <Typography component="span" variant="subtitle1">
                  / YEAR
                </Typography>
              </div>
            }
            features={[
              'Everything in Standard',
              'Encrypted Data Backup',
              'Zero-Knowledge Storage',
              'Enhanced Support',
            ]}
            featureCheckComponent={
              <Icon
                fontIconClass="far fa-check-circle"
                fontIconColor={theme.palette.secondary.main}
              />
            }
            cta={
              <Button
                color="primary"
                variant="outlined"
                fullWidth
                size="large"
                href="/download"
                startIcon={<Launch />}
              >
                Get Started
              </Button>
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};

Pricings.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Pricings;
