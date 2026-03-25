using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PADIDI.API.Data;
using PADIDI.API.DTOs.Ads;
using PADIDI.API.Models;
using PADIDI.API.Services.Interfaces;

namespace PADIDI.API.Services;

public class AdService : IAdService
{
    private readonly AdminDbContext _db;
    private readonly IMapper _mapper;

    public AdService(AdminDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<List<AdReadDto>> GetActiveAsync()
    {
        var ads = await _db.Ads.Where(a => a.IsActive).OrderByDescending(a => a.CreatedAt).ToListAsync();
        return _mapper.Map<List<AdReadDto>>(ads);
    }

    public async Task<List<AdReadDto>> GetAllAsync()
    {
        var ads = await _db.Ads.OrderByDescending(a => a.CreatedAt).ToListAsync();
        return _mapper.Map<List<AdReadDto>>(ads);
    }

    public async Task<AdReadDto> CreateAsync(AdCreateDto dto, string imagePath)
    {
        if (!Uri.TryCreate(dto.RedirectUrl, UriKind.Absolute, out _))
            throw new ArgumentException("RedirectUrl must be an absolute URI.");

        var ad = new Ad
        {
            Id = Guid.NewGuid(),
            ImagePath = imagePath,
            RedirectUrl = dto.RedirectUrl,
            IsActive = dto.IsActive,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _db.Ads.Add(ad);
        await _db.SaveChangesAsync();
        return _mapper.Map<AdReadDto>(ad);
    }

    public async Task<AdReadDto> UpdateAsync(Guid id, AdUpdateDto dto)
    {
        var ad = await _db.Ads.FindAsync(id);
        if (ad == null) throw new KeyNotFoundException("Ad not found.");

        if (!Uri.TryCreate(dto.RedirectUrl, UriKind.Absolute, out _))
            throw new ArgumentException("RedirectUrl must be an absolute URI.");

        ad.RedirectUrl = dto.RedirectUrl;
        ad.IsActive = dto.IsActive;
        ad.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return _mapper.Map<AdReadDto>(ad);
    }

    public async Task DeleteAsync(Guid id)
    {
        var ad = await _db.Ads.FindAsync(id);
        if (ad == null) throw new KeyNotFoundException("Ad not found.");

        _db.Ads.Remove(ad);
        await _db.SaveChangesAsync();
    }
}
