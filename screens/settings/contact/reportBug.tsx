import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "interfaces";
import Back from "components/Back";
import {
  ColumnCenterWrapper,
  KeyboardScreen,
  InputsWrapper,
  HelperButton,
} from "styles/shared";
import i18n from "config/i18n";
import BasicTextInput from "components/BasicTextInput";
import { Formik, FormikHelpers } from "formik";
import { ReportBugSchema } from "schemas/ReportBug.schema";
import { View } from "react-native";
import BasicButton from "components/BasicButton";
import Loader from "components/Loader";
import { ICON_SIZE_PX } from "config";
import { reportBug } from "services/plant";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import ReportBugHelpModal from "modals/ReportBugHelp";
import { ApiErrors } from "enums/api-errors";
import { showToast } from "utils/toast";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "settingsContactReportBug"
>;

const { t } = i18n;

const MIN_DESCRIPTION_LENGTH = 5;

interface ReportBugForm {
  email: string;
  description: string;
}

const ReportBug = ({ navigation }: Props): JSX.Element => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (
    values: ReportBugForm,
    formikHelpers: FormikHelpers<ReportBugForm>
  ) => {
    try {
      setLoading(true);
      await reportBug(values);
      formikHelpers.resetForm();
      navigation.navigate("home");
      showToast({
        text1: t("pages.settings.reportBug.success"),
        type: "success",
      });
    } catch (error) {
      switch (error) {
        case ApiErrors.TOO_MANY_BUG_REPORTS:
          return showToast({
            text1: t("errors.tooManyBugReports"),
            type: "error",
          });
        default:
          return showToast({
            text1: t("errors.general"),
            text2: t("errors.generalDescription"),
            type: "error",
          });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <KeyboardScreen
        contentContainerStyle={{ paddingBottom: 50 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        bounces={false}
        style={{
          backgroundColor: theme.background,
        }}
      >
        <ColumnCenterWrapper>
          <Back navigation={navigation} />
          <HelperButton onPress={() => setShowHelpModal(true)}>
            <AntDesign
              name="question"
              size={ICON_SIZE_PX}
              color={theme.textLight}
            />
          </HelperButton>
          {loading ? (
            <Loader topMargin />
          ) : (
            <Formik
              initialValues={{ email: "", description: "" }}
              validationSchema={ReportBugSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <InputsWrapper>
                  <BasicTextInput
                    value={values.email}
                    label={t("pages.settings.reportBug.emailLabel")}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={errors.email}
                  />
                  <BasicTextInput
                    value={values.description}
                    label={t("pages.settings.reportBug.descriptionLabel")}
                    placeholder={t(
                      "pages.settings.reportBug.descriptionPlaceholder"
                    )}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    error={errors.description}
                    textarea
                  />
                  <View style={{ marginVertical: 30 }}>
                    <BasicButton
                      onPress={handleSubmit}
                      text={t("common.submit")}
                      disabled={
                        values.description.length < MIN_DESCRIPTION_LENGTH
                      }
                    />
                  </View>
                </InputsWrapper>
              )}
            </Formik>
          )}
        </ColumnCenterWrapper>
      </KeyboardScreen>
      <ReportBugHelpModal
        showModal={showHelpModal}
        toggleModal={setShowHelpModal}
      />
    </>
  );
};

export default ReportBug;
