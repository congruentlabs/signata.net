import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Button,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
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

const Wallets = ({ className, disabled, wallets, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [showManageWallet, setShowManageWallet] = React.useState(false);
  const [walletToManage, setWalletToManage] = React.useState(undefined);
  const [showAddWallet, setShowAddWallet] = React.useState(false);
  const { t } = useTranslation();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleClickManageWallet = (e, wallet) => {
    e.preventDefault();
    setWalletToManage(wallet);
    setShowManageWallet(true);
  };

  const handleClickAddWallet = (e) => {
    e.preventDefault();
    setShowAddWallet(true);
  };

  return (
    <div className={className} {...rest}>
      {showManageWallet && walletToManage && (
        <></>
      )}

      {showAddWallet && (
        <></>
      )}

      <Section className={classes.noPadding}>
        <SectionHeader
          title="Wallets"
          subtitle="Create or import your existing wallets to protect in Signata."
          align="left"
        />
      </Section>
      <Section className={classes.noPadding}>
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
                    onClick={(e) => handleClickManageWallet(e, wallet)}
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
                onClick={handleClickAddWallet}
                fullWidth
                disabled={disabled}
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
