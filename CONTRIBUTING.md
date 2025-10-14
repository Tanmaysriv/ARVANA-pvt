# Contributing to ARVANA

Thank you for your interest in contributing to ARVANA! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/device information

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Ensure the app runs without errors
   - Test AR functionality
   - Check responsive design

5. **Commit your changes**
   ```bash
   git commit -m "Add: Brief description of changes"
   ```
   
   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots/videos if applicable

## 📝 Code Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use meaningful variable and function names
- Keep components small and focused
- Use PropTypes or TypeScript for type checking
- Follow ESLint rules

```javascript
// Good
const ProductCard = ({ product, onTryOn }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  
  return (
    <div className="card">
      {/* Component content */}
    </div>
  )
}

// Avoid
function comp(p) {
  let x = false
  return <div>{/* ... */}</div>
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Use semantic class names for custom styles
- Follow mobile-first approach

```jsx
// Good
<button className="btn-primary hover:bg-primary-700 transition-colors">
  Click Me
</button>

// Avoid
<button style={{ backgroundColor: 'blue', padding: '10px' }}>
  Click Me
</button>
```

### File Organization

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── data/          # Static data and constants
├── utils/         # Utility functions
└── styles/        # Global styles
```

## 🧪 Testing

Before submitting a PR:

1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Test on mobile devices
3. Test AR functionality with all product categories
4. Check console for errors
5. Verify responsive design

## 📚 Documentation

When adding new features:

1. Update README.md if needed
2. Add JSDoc comments to functions
3. Update QUICKSTART.md for user-facing features
4. Include inline comments for complex logic

```javascript
/**
 * Detects hand pose and overlays AR content
 * @param {HTMLVideoElement} video - Video element
 * @param {HTMLCanvasElement} canvas - Canvas for drawing
 * @param {string} category - Product category
 * @returns {Object} Detection results
 */
const detectHandPose = (video, canvas, category) => {
  // Implementation
}
```

## 🎨 Design Guidelines

- Follow the existing design system
- Use consistent spacing and sizing
- Maintain color scheme (primary, secondary, etc.)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test with different screen sizes

## 🔧 Development Setup

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Make changes
4. Test thoroughly
5. Submit PR

## 📋 Pull Request Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] Changes are tested
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No console errors
- [ ] Responsive design works
- [ ] AR functionality works (if applicable)

## 🚫 What Not to Do

- Don't submit PRs with unrelated changes
- Don't ignore ESLint warnings
- Don't hardcode values that should be configurable
- Don't remove existing functionality without discussion
- Don't submit untested code

## 💡 Areas for Contribution

### High Priority
- Performance optimizations
- Additional AR models
- More product categories
- Mobile app development
- Accessibility improvements

### Medium Priority
- UI/UX enhancements
- Additional features
- Documentation improvements
- Test coverage
- Internationalization

### Good First Issues
- UI polish
- Bug fixes
- Documentation updates
- Adding products to catalog
- Styling improvements

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

## 📧 Questions?

- Open a discussion on GitHub
- Email: dev@arvana.com
- Join our Discord community

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow GitHub's community guidelines

---

Thank you for contributing to ARVANA! 🎉
