import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 200px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 200px;
        height: 38px;
`);

function Logo() {
  return (
    <LogoWrapper to="/login">
      <LogoSignWrapper>
        <Box component="img" src="./static/images/logo/logo.svg" sx={{height:"46px", width:"200px"}}></Box>
      </LogoSignWrapper>
    </LogoWrapper>
  );
}

export default Logo;
