import { createRef } from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { UserPic } from './UserPic';

const SAMPLE_AVATAR_URL = 'https://example.com/avatar.jpg';

describe('UserPic', () => {
  describe('Базовый рендеринг', () => {
    it('рендерит компонент с изображением', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveStyle({
        backgroundImage: `url("${SAMPLE_AVATAR_URL}")`,
      });
    });

    it('использует alt текст по умолчанию', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} />);
      expect(screen.getByRole('img', { name: 'Аватар пользователя' })).toBeInTheDocument();
    });

    it('использует кастомный alt текст', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} alt="Джон Доу" />);
      expect(screen.getByRole('img', { name: 'Джон Доу' })).toBeInTheDocument();
    });

    it('рендерит как div по умолчанию', () => {
      const { container } = render(<UserPic imgUrl={SAMPLE_AVATAR_URL} />);
      const avatar = container.querySelector('div[role="img"]');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Размеры', () => {
    it('применяет размер sm', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} size="sm" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({ '--user-pic-size': '1.5rem' });
    });

    it('применяет размер md (по умолчанию)', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({ '--user-pic-size': '2rem' });
    });

    it('применяет размер lg', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} size="lg" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({ '--user-pic-size': '2.5rem' });
    });

    it('применяет размер xl', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} size="xl" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({ '--user-pic-size': '3rem' });
    });

    it('применяет числовой размер в пикселях', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} size={64} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({ '--user-pic-size': '64px' });
    });

    it('применяет кастомный CSS размер', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} size="5rem" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({ '--user-pic-size': '5rem' });
    });
  });

  describe('Режим ссылки', () => {
    it('рендерит как ссылку когда передан href', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/profile');
    });

    it('добавляет rel="noopener noreferrer" для target="_blank"', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} href="https://example.com" target="_blank" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('не добавляет rel для внутренних ссылок', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" />);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('rel');
    });

    it('использует кастомный rel', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" rel="nofollow" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'nofollow');
    });

    it('применяет стили к ссылке', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" />);
      const link = screen.getByRole('link');
      expect(link).toHaveStyle({
        backgroundImage: `url("${SAMPLE_AVATAR_URL}")`,
      });
    });

    it('рендерит ссылку с различными target', () => {
      const { rerender } = render(
        <UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" target="_self" />
      );
      expect(screen.getByRole('link')).toHaveAttribute('target', '_self');

      rerender(<UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" target="_parent" />);
      expect(screen.getByRole('link')).toHaveAttribute('target', '_parent');

      rerender(<UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" target="_top" />);
      expect(screen.getByRole('link')).toHaveAttribute('target', '_top');
    });
  });

  describe('Forwarded ref', () => {
    it('передает ref для div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<UserPic ref={ref} imgUrl={SAMPLE_AVATAR_URL} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'img');
    });

    it('передает ref для ссылки', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(<UserPic ref={ref} imgUrl={SAMPLE_AVATAR_URL} href="/profile" />);
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ref.current).toHaveAttribute('href', '/profile');
    });
  });

  describe('Дополнительные пропсы', () => {
    it('передает className', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} className="custom-class" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('custom-class');
    });

    it('передает data атрибуты для div', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} data-testid="custom-avatar" />);
      expect(screen.getByTestId('custom-avatar')).toBeInTheDocument();
    });

    it('передает data атрибуты для ссылки', () => {
      render(
        <UserPic imgUrl={SAMPLE_AVATAR_URL} href="/profile" data-testid="custom-avatar-link" />
      );
      expect(screen.getByTestId('custom-avatar-link')).toBeInTheDocument();
    });

    it('передает aria атрибуты', () => {
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} aria-describedby="avatar-description" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('aria-describedby', 'avatar-description');
    });

    it('передает onClick для div', () => {
      const handleClick = jest.fn();
      render(<UserPic imgUrl={SAMPLE_AVATAR_URL} onClick={handleClick} />);
      const avatar = screen.getByRole('img');
      avatar.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Комбинация свойств', () => {
    it('правильно работает с несколькими свойствами', () => {
      render(
        <UserPic
          imgUrl={SAMPLE_AVATAR_URL}
          size="lg"
          alt="Пользователь"
          className="custom-avatar"
        />
      );
      const avatar = screen.getByRole('img', { name: 'Пользователь' });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass('custom-avatar');
      expect(avatar).toHaveStyle({ '--user-pic-size': '2.5rem' });
    });

    it('работает как ссылка с множеством модификаторов', () => {
      render(
        <UserPic
          imgUrl={SAMPLE_AVATAR_URL}
          href="/profile"
          target="_blank"
          size="xl"
          alt="Открыть профиль"
          className="profile-link"
        />
      );
      const link = screen.getByRole('link', { name: 'Открыть профиль' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('profile-link');
      expect(link).toHaveAttribute('href', '/profile');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveStyle({ '--user-pic-size': '3rem' });
    });
  });

  describe('Стили', () => {
    it('применяет backgroundImage из imgUrl', () => {
      const customUrl = 'https://example.com/custom-avatar.png';
      render(<UserPic imgUrl={customUrl} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({
        backgroundImage: `url("${customUrl}")`,
      });
    });

    it('применяет различные imgUrl', () => {
      const { rerender } = render(<UserPic imgUrl="https://example.com/avatar1.jpg" />);
      let avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({
        backgroundImage: 'url("https://example.com/avatar1.jpg")',
      });

      rerender(<UserPic imgUrl="https://example.com/avatar2.jpg" />);
      avatar = screen.getByRole('img');
      expect(avatar).toHaveStyle({
        backgroundImage: 'url("https://example.com/avatar2.jpg")',
      });
    });
  });

  describe('Все размеры', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    const expectedSizes = {
      sm: '1.5rem',
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem',
    };

    sizes.forEach((size) => {
      it(`рендерит размер "${size}"`, () => {
        render(<UserPic imgUrl={SAMPLE_AVATAR_URL} size={size} />);
        const avatar = screen.getByRole('img');
        expect(avatar).toHaveStyle({ '--user-pic-size': expectedSizes[size] });
      });
    });
  });
});
