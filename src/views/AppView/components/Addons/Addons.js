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
import { Icon, LearnMoreLink } from 'components/atoms';
import { IconAlternate, SectionHeader } from 'components/molecules';
import { DescriptionListIcon, Section, CardPricingStandard } from 'components/organisms';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
  noPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const Addons = ({ className, disabled, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const onClickCloudUpgrade = (e) => {
    e.preventDefault();
  };

  return (
    <div className={className} {...rest}>
      <Section className={classes.noPadding}>
        <SectionHeader
          title="Addons"
          subtitle={''}
          align="left"
        />
      </Section>
      <Section className={classes.noPadding}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <CardPricingStandard
              liftUp
              title="Cloud Backup"
              subtitle="Keep your data safe"
              priceComponent={(
                <>
                  <Typography
                    variant="h4"
                    component="span"
                    style={{ fontWeight: 900 }}
                  >
                    20 SATA
                  </Typography>
                  <Typography
                    component="span"
                    variant="subtitle1"
                  >
                    / YEAR
                </Typography>
                </>
              )}
              features={[
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
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={onClickCloudUpgrade}
                  disabled={disabled}
                >
                  Upgrade Now
                </Button>
              }
            />
          </Grid>
        </Grid>
      </Section>
    </div>
  );
};

Addons.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Addons;
