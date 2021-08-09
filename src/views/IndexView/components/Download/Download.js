import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  cardBase: {
    background: theme.palette.primary.main,
    [theme.breakpoints.up('md')]: {
      background: `url(https://assets.maccarianagency.com/the-front/illustrations/newsletter-bg.svg) no-repeat 150% 50% ${theme.palette.primary.dark}`,
    },
  },
  textWhite: {
    color: 'white',
  },
  sectionHeader: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '60%',
    },
  },
}));

const Subscription = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <CardBase
        variant="outlined"
        liftUp
        className={classes.cardBase}
        align="left"
        data-aos="fade-up"
      >
        <SectionHeader
          title={
            <span className={classes.textWhite}>
              Get Signata, and join the identity revolution.
            </span>
          }
          subtitle={
            <span className={classes.textWhite}>
              Download for Windows and macOS.
            </span>
          }
          fadeUp
          align="left"
          ctaGroup={[
            <Button
              variant="contained"
              size="large"
              href="/download"
            >
              Download now
            </Button>,
          ]}
          disableGutter
          className={classes.sectionHeader}
        />
      </CardBase>
    </div>
  );
};

Subscription.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Subscription;
