import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { LearnMoreLink, Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
// import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  logo: {
    maxWidth: 50,
  },
}));

const Token = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <SectionHeader
            title="Built on blockchain technology, for the world."
            subtitle="The SATA token is at the core of Signata. Decentralized identity, all the control in your hands. This is tomorrow's technology."
            align="left"
            label="Blockchain Technology"
            ctaGroup={[
              <LearnMoreLink
                title="Learn about SATA"
                href="https://sata.technology/"
                variant="h6"
              />,
            ]}
            disableGutter
          />
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <Grid container spacing={2}>
            {/* <Grid item xs={6}>
              <Image
                src="/logo.png"
                alt="SATA Logo"
                // className={classes.logo}
                lazy={false}
              />
            </Grid> */}
            {/* {data.map((item, index) => (
              <Grid item xs={4} key={index}>
                <CardBase withShadow liftUp>
                  <Image
                    src={item.logo}
                    alt={item.name}
                    className={classes.logo}
                    lazy={false}
                  />
                </CardBase>
              </Grid>
            ))} */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Token.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Token;
