import React from 'react';
import { Section, SectionAlternate } from 'components/organisms';
import {
  DownloadInfo,
  Extensions,
} from './components';

const DownloadView = () => (
  <div>
    <Section>
      <DownloadInfo />
    </Section>
    <SectionAlternate>
      <Extensions />
    </SectionAlternate>
  </div>
);

export default DownloadView;
