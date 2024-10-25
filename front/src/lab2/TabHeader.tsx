import { Box, Button, Flex } from '@chakra-ui/react';
import { TabType } from './etc/types';
import { MORPH_FUNCTIONS, NONLINEAR_FUNCTIONS } from './etc/constants';

interface TabHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedFunction: string;
  handleApplyFilter: () => void;
  handleFunctionSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedFunction,
  handleApplyFilter,
  handleFunctionSelect
}) => {
  return (
    <Box borderBottom="1px" borderColor="gray.200" p={4}>
      <Flex justify="space-between" align="center">
        <Flex gap={2}>
          <Button
            onClick={() => setActiveTab('morph')}
            variant={activeTab === 'morph' ? 'solid' : 'outline'}
            colorScheme="blue"
            borderRadius="md"
          >
            Morph
          </Button>
          <Button
            onClick={() => setActiveTab('nonlinear')}
            variant={activeTab === 'nonlinear' ? 'solid' : 'outline'}
            colorScheme="blue"
            borderRadius="md"
          >
            Nonlinear
          </Button>
        </Flex>

        <Flex align="center" gap={4}>
          <Button
            size="sm"
            onClick={handleApplyFilter}
            disabled={!selectedFunction}
            colorScheme="blue"
          >
            Apply
          </Button>
        </Flex>
      </Flex>

      <Box mt={4}>
        <select
          className="chakra-select"
          style={{
            width: '200px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0'
          }}
          onChange={handleFunctionSelect}
          value={selectedFunction}
        >
          <option value="">Select function</option>
          {(activeTab === 'morph' ? MORPH_FUNCTIONS : NONLINEAR_FUNCTIONS).map(func => (
            <option key={func} value={func}>
              {func}
            </option>
          ))}
        </select>
      </Box>
    </Box>
  );
};