import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography, colors } from '@material-ui/core';
import { IconAlternate, SectionHeader } from 'components/molecules';
import { DescriptionListIcon, Section } from 'components/organisms';
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

const Addons = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

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
