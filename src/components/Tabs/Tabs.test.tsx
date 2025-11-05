import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { Tab, Tabs } from './Tabs';

describe('Tabs', () => {
  describe('Базовый рендеринг', () => {
    it('рендерит компонент с табами', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Таб 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Таб 2' })).toBeInTheDocument();
    });

    it('рендерит табы с правильными ролями и атрибутами', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });

    it('показывает содержимое первого таба по умолчанию', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByText('Содержимое 1')).toBeInTheDocument();
      expect(screen.queryByText('Содержимое 2')).not.toBeInTheDocument();
    });

    it('показывает содержимое таба, указанного в defaultValue', () => {
      render(
        <Tabs defaultValue="tab2">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByText('Содержимое 2')).toBeInTheDocument();
      expect(screen.queryByText('Содержимое 1')).not.toBeInTheDocument();
    });
  });

  describe('Взаимодействие с табами', () => {
    it('переключается на следующий таб при клике', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));

      expect(screen.getByText('Содержимое 2')).toBeInTheDocument();
      expect(screen.queryByText('Содержимое 1')).not.toBeInTheDocument();
    });

    it('устанавливает aria-selected правильно для активного таба', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Таб 1' });
      const tab2 = screen.getByRole('tab', { name: 'Таб 2' });

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      fireEvent.click(tab2);

      expect(tab1).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('обновляет aria-selected при переключении', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
          <Tab label="Таб 3" value="tab3">
            <div>Содержимое 3</div>
          </Tab>
        </Tabs>
      );

      const tab2 = screen.getByRole('tab', { name: 'Таб 2' });
      const tab3 = screen.getByRole('tab', { name: 'Таб 3' });

      fireEvent.click(tab2);
      expect(tab2).toHaveAttribute('aria-selected', 'true');

      fireEvent.click(tab3);
      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tab3).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Disabled табы', () => {
    it('рендерит disabled таб с aria-disabled="true"', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2" disabled>
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      const disabledTab = screen.getByRole('tab', { name: 'Таб 2' });
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
      expect(disabledTab).toBeDisabled();
    });

    it('не переключается на disabled таб при клике', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2" disabled>
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      const disabledTab = screen.getByRole('tab', { name: 'Таб 2' });
      fireEvent.click(disabledTab);

      expect(screen.getByText('Содержимое 1')).toBeInTheDocument();
      expect(screen.queryByText('Содержимое 2')).not.toBeInTheDocument();
    });
  });

  describe('Контролируемый компонент', () => {
    it('использует value prop для управления активным табом', () => {
      const { rerender } = render(
        <Tabs value="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByText('Содержимое 1')).toBeInTheDocument();

      rerender(
        <Tabs value="tab2">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByText('Содержимое 2')).toBeInTheDocument();
    });

    it('вызывает onChange при клике на таб', () => {
      const handleChange = jest.fn();
      render(
        <Tabs value="tab1" onChange={handleChange}>
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));

      expect(handleChange).toHaveBeenCalledWith('tab2');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('не переключается при клике если onChange не обновляет value', () => {
      const handleChange = jest.fn();
      render(
        <Tabs value="tab1" onChange={handleChange}>
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));

      expect(screen.getByText('Содержимое 1')).toBeInTheDocument();
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Неконтролируемый компонент', () => {
    it('переключается на таб при клике без value prop', () => {
      const handleChange = jest.fn();
      render(
        <Tabs defaultValue="tab1" onChange={handleChange}>
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));

      expect(screen.getByText('Содержимое 2')).toBeInTheDocument();
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('вызывает onChange даже для неконтролируемого компонента', () => {
      const handleChange = jest.fn();
      render(
        <Tabs defaultValue="tab1" onChange={handleChange}>
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));

      expect(handleChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Свойства variant', () => {
    it('применяет вариант default', () => {
      render(
        <Tabs defaultValue="tab1" variant="default">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
        </Tabs>
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
    });

    it('применяет вариант pills', () => {
      render(
        <Tabs defaultValue="tab1" variant="pills">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
        </Tabs>
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
    });

    it('применяет вариант underline', () => {
      render(
        <Tabs defaultValue="tab1" variant="underline">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
        </Tabs>
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
    });
  });

  describe('Свойства size', () => {
    it('применяет размер small', () => {
      render(
        <Tabs defaultValue="tab1" size="small">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('применяет размер medium', () => {
      render(
        <Tabs defaultValue="tab1" size="medium">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('применяет размер large', () => {
      render(
        <Tabs defaultValue="tab1" size="large">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  describe('Свойство fullWidth', () => {
    it('рендерит табы с fullWidth=true', () => {
      render(
        <Tabs defaultValue="tab1" fullWidth>
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('рендерит табы с fullWidth=false', () => {
      render(
        <Tabs defaultValue="tab1" fullWidth={false}>
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  describe('Комбинация свойств', () => {
    it('работает с несколькими модификаторами одновременно', () => {
      const handleChange = jest.fn();
      render(
        <Tabs defaultValue="tab1" variant="pills" size="large" fullWidth onChange={handleChange}>
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));

      expect(screen.getByText('Содержимое 2')).toBeInTheDocument();
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('работает с disabled табом и variant', () => {
      render(
        <Tabs defaultValue="tab1" variant="underline">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
          <Tab label="Таб 2" value="tab2" disabled>
            <div>Содержимое 2</div>
          </Tab>
        </Tabs>
      );

      const disabledTab = screen.getByRole('tab', { name: 'Таб 2' });
      fireEvent.click(disabledTab);

      expect(screen.getByText('Содержимое 1')).toBeInTheDocument();
      expect(disabledTab).toBeDisabled();
    });
  });

  describe('Содержимое табов', () => {
    it('отображает правильное содержимое при переключении между табами', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое первого таба</div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Содержимое второго таба</div>
          </Tab>
          <Tab label="Таб 3" value="tab3">
            <div>Содержимое третьего таба</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByText('Содержимое первого таба')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));
      expect(screen.getByText('Содержимое второго таба')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 3' }));
      expect(screen.getByText('Содержимое третьего таба')).toBeInTheDocument();
    });

    it('показывает содержимое таба с complex структурой', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>
              <h2>Заголовок</h2>
              <p>Параграф с текстом</p>
              <button>Кнопка</button>
            </div>
          </Tab>
          <Tab label="Таб 2" value="tab2">
            <div>Простое содержимое</div>
          </Tab>
        </Tabs>
      );

      expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Кнопка' })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 2' }));
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('обрабатывает пустой список табов', () => {
      render(
        <Tabs defaultValue="tab1">
          <></>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('обрабатывает один таб', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tab label="Таб 1" value="tab1">
            <div>Содержимое 1</div>
          </Tab>
        </Tabs>
      );

      const tab = screen.getByRole('tab', { name: 'Таб 1' });
      expect(tab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Содержимое 1')).toBeInTheDocument();
    });

    it('обрабатывает много табов', () => {
      render(
        <Tabs defaultValue="tab1">
          {Array.from({ length: 10 }, (_, i) => (
            <Tab key={i} label={`Таб ${i + 1}`} value={`tab${i + 1}`}>
              <div>Содержимое {i + 1}</div>
            </Tab>
          ))}
        </Tabs>
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(10);

      fireEvent.click(screen.getByRole('tab', { name: 'Таб 5' }));
      expect(screen.getByText('Содержимое 5')).toBeInTheDocument();
    });
  });
});
