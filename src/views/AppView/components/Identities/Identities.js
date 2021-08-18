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
  }
}));

const Identities = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [identities, setIdentities] = useLocalStorageState('identities', []);
  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Section className={classes.noPadding}>
        <SectionHeader
          title="Identities"
          subtitle="Create identities to use for accessing the web."
          align="left"
        />
      </Section>
      <Section className={classes.noPadding}>
        <Grid container spacing={2}>
          {identities.map((identity) => (
            <Grid key={identity.id} item xs={12} md={4}>
              <CardPricingStandard
                title="Identity"
                subtitle={identity.title}
                // disclaimer={secureNote.serialNumber}
                cta={(
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    View / Edit
                  </Button>
                )}
              />
            </Grid>
          ))}

          <Grid item xs={12} md={4}>
            <CardBase>
              <Button
                color="secondary"
                variant={identities.length < 1 ? "contained" : "outlined"}
                fullWidth
              >
                Add New Identity
              </Button>
            </CardBase>
          </Grid>
        </Grid>
      </Section>
    </div>
  );
};

Identities.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Identities;
