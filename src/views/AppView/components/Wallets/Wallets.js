import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import {
  useMediaQuery,
  Grid,
  Typography,
  colors,
  Button,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import FileCopyIcon from '@material-ui/icons/FileCopy';
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

const Wallets = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [wallets, setWallets, isPersistent] = useLocalStorageState('wallets', []);
  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Section className={classes.noPadding}>
        <SectionHeader
          title="Wallets"
          subtitle="Create or import your existing wallets to protect in Signata."
          align="left"
        />
      </Section><Section className={classes.noPadding}>
        <Grid container spacing={2}>
          {wallets.map((wallet) => (
            <Grid key={wallet.id} item xs={12} md={4}>
              <CardPricingStandard
                title={wallet.name}
                subtitle={wallet.type}
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
                variant={wallets.length < 1 ? "contained" : "outlined"}
                fullWidth
              >
                Add Wallet
              </Button>
            </CardBase>
          </Grid>
        </Grid>
      </Section>
    </div>
  );
};

Wallets.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Wallets;
