/**
 * Finnomena wordmark. This is a text-based recreation using the theme's
 * brand font (applied globally by ThemeProvider) and the "fg" color token —
 * NOT an extraction of the real production logo asset. The live app's logo
 * is a bundled image with no public/hotlinkable URL (confirmed via network
 * inspection of trade.finnomena.com), so there's nothing to link to or copy
 * directly. Swap for an official logo file if one becomes available.
 */
import { Box } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography";

export function Logo() {
  return (
    <Box as="a" href="https://www.finnomena.com" target="_blank" rel="noopener noreferrer" textDecoration="none">
      <Text color="fg" fontSize="title3" fontWeight="title3">
        Finnomena
      </Text>
    </Box>
  );
}
