import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';
import { Modal, ModalProps } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Статус открытия модального окна',
    },
    title: {
      control: 'text',
      description: 'Заголовок модального окна',
    },
    description: {
      control: 'text',
      description: 'Описание под заголовком',
    },
    size: {
      control: 'select',
      options: ['auto', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Размер модального окна',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Закрывать при клике по оверлею',
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Закрывать по клавише Escape',
    },
    disableBodyScroll: {
      control: 'boolean',
      description: 'Блокировать прокрутку body',
    },
    hideCloseButton: {
      control: 'boolean',
      description: 'Скрыть кнопку закрытия',
    },
    closeButtonLabel: {
      control: 'text',
      description: 'Лейбл кнопки закрытия',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<ModalProps>;

export const Playground: Story = {
  render: (args) => {
    const [isOpen, setOpen] = useState(args.isOpen ?? true);

    return (
      <>
        <Button view="action" onClick={() => setOpen(true)}>
          Открыть модалку
        </Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          footer={
            args.footer ?? (
              <>
                <Button view="flat" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <Button view="action" onClick={() => setOpen(false)}>
                  Сохранить
                </Button>
              </>
            )
          }
        >
          {args.children ?? (
            <>
              <p>
                Модальное окно поддерживает заголовок, описание, произвольный контент и подвал с
                кнопками. По умолчанию фокус замыкается внутри модалки, а фон за ней блокируется от
                прокрутки.
              </p>
              <p>
                Используйте свойства <code>size</code>, <code>closeOnOverlayClick</code>,{' '}
                <code>hideCloseButton</code> и другие для управления поведением.
              </p>
            </>
          )}
        </Modal>
      </>
    );
  },
  args: {
    isOpen: true,
    title: 'Заголовок модального окна',
    description: 'Это описание помогает пользователю понять контекст действия.',
    size: 'auto',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {(['sm', 'md', 'lg', 'xl', 'full'] as ModalProps['size'][]).map((size) => (
        <div key={size}>
          <h4>Размер: {size}</h4>
          <Modal
            {...args}
            size={size}
            isOpen
            title={`Модалка размера ${size?.toUpperCase()}`}
            description="Каждый размер задаёт ограничение ширины модального окна."
            footer={
              <>
                <Button view="flat">Отмена</Button>
                <Button view="action">Продолжить</Button>
              </>
            }
          >
            <p>
              Используйте различные размеры для адаптации модального окна под контент. По умолчанию
              ширина ограничивается 36rem.
            </p>
          </Modal>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Демонстрация стандартных размеров модального окна.',
      },
    },
  },
  args: {
    closeOnOverlayClick: false,
  },
};

export const WithLongContent: Story = {
  render: (args) => (
    <Modal
      {...args}
      isOpen
      title="Длинный контент"
      description="Основная часть прокручивается при переполнении."
      footer={
        <>
          <Button view="flat">Назад</Button>
          <Button view="action">Готово</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[...Array(12)].map((_, index) => (
          <p key={index}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, aliquid asperiores aut
            commodi culpa cupiditate dignissimos doloremque est illum inventore iure maxime natus
            nobis odit quibusdam recusandae sit unde voluptas!
          </p>
        ))}
      </div>
    </Modal>
  ),
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Основной контент ограничен по высоте и прокручивается, не влияя на шапку и подвал.',
      },
    },
  },
};

export const WithoutCloseButton: Story = {
  render: (args) => (
    <Modal
      {...args}
      isOpen
      hideCloseButton
      title="Без кнопки закрытия"
      description="Закрытие доступно только через действия пользователя."
      footer={
        <Button view="flat" onClick={args.onClose}>
          Понял
        </Button>
      }
    >
      <p>
        Используйте свойство <code>hideCloseButton</code>, если хотите явно контролировать способ
        закрытия модального окна и вынудить пользователя выбрать одно из действий.
      </p>
    </Modal>
  ),
};