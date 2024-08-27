import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "interfaces";
import Back from "components/Back";
import BasicButton from "components/BasicButton";
import { SettingsSection } from "components/Settings/styles";
import SettingsHeader from "components/Settings/header";
import SettingsItem from "components/Settings/item";
import { ColumnCenterWrapper, ScreenContainer } from "styles/shared";
import {
  AppVersionText,
  AppVersionWrapper,
} from "styles/screens/settings.styles";
import i18n from "config/i18n";
import { getCurrentAppVersion } from "utils";

type Props = NativeStackScreenProps<RootStackParamList, "settings">;

const { t } = i18n;

const Settings = ({ navigation }: Props): JSX.Element => {
  return (
    <ScreenContainer>
      <Back navigation={navigation} />
      <ColumnCenterWrapper fullHeight>
        <SettingsSection>
          <SettingsHeader text={t("pages.settings.header")} />
          <SettingsItem>
            <BasicButton
              onPress={() => navigation.navigate("settingsNotifications")}
              text={t("pages.settings.notificationsHeader")}
            />
          </SettingsItem>
          <SettingsItem>
            <BasicButton
              onPress={() => navigation.navigate("settingsApp")}
              text={t("pages.settings.app.header")}
            />
          </SettingsItem>
        </SettingsSection>
        <SettingsSection>
          <SettingsHeader text={t("pages.settings.contact")} />
          <SettingsItem>
            <BasicButton
              onPress={() => navigation.navigate("settingsContactReportBug")}
              text={t("pages.settings.reportBug.header")}
            />
          </SettingsItem>
        </SettingsSection>
        <AppVersionWrapper>
          <AppVersionText>
            {t("pages.settings.appVersion", {
              version: getCurrentAppVersion() || "1.2.3",
            })}
          </AppVersionText>
        </AppVersionWrapper>
      </ColumnCenterWrapper>
    </ScreenContainer>
  );
};

export default Settings;
