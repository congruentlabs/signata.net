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

const SecureNotes = ({ className, disabled, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [secureNotes, setSecureNotes] = useLocalStorageState('secureNotes', []);
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Section className={classes.noPadding}>
        <SectionHeader
          title="Secure Notes"
          subtitle={''}
          align="left"
        />
      </Section>
      <Section className={classes.noPadding}>
        <Grid container spacing={2}>
          {secureNotes.map((secureNote) => (
            <Grid key={secureNote.id} item xs={12} md={4}>
              <CardPricingStandard
                title={secureNote.title}
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
                variant={secureNotes.length < 1 ? "contained" : "outlined"}
                fullWidth
                disabled={disabled}
              >
                Add Secure Note
              </Button>
            </CardBase>
          </Grid>
        </Grid>
      </Section>
    </div>
  );
};

SecureNotes.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default SecureNotes;
