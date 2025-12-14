namespace Server.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty; // İş Tanımı
    public string? Assignee { get; set; } // Atanan Kişi (Boş olabilir)
    public bool IsCompleted { get; set; } = false; // Tamamlandı mı?
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Oluşturulma Tarihi
}