import { Img } from '@react-email/components';

const logoStyle = {
  marginBottom: '40px',
};

type LogoProps = {
  serverUrl?: string;
};

export const Logo = ({ serverUrl = 'https://jusdeal.fass-legal.com' }: LogoProps) => {
  return (
    <Img
      src={`${serverUrl}/images/icons/android/android-launchericon-192-192.png`}
      alt="JusDeal logo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
