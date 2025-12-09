import { atom } from 'recoil';
import { localStorageEffect } from '~/utils/recoil-effects';
import { ReportConfig } from '../types/ReportConfig';

export const savedReportsState = atom<ReportConfig[]>({
  key: 'savedReportsState',
  default: [],
  effects: [localStorageEffect()],
});

export const currentReportConfigState = atom<ReportConfig | null>({
  key: 'currentReportConfigState',
  default: null,
});

export const isReportBuilderOpenState = atom<boolean>({
  key: 'isReportBuilderOpenState',
  default: false,
});

